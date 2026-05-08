import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: No usar getSession() — usar getUser() para validar contra el servidor
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Rutas protegidas ciudadano
  const isProtectedCiudadano =
    path.startsWith('/dashboard') ||
    path.startsWith('/pagos') ||
    path.startsWith('/perfil') ||
    path.startsWith('/ia') ||
    path.startsWith('/kyc') ||
    path.startsWith('/pagar');

  // Rutas protegidas gobierno
  const isProtectedAdmin = path.startsWith('/admin');

  // Rutas de autenticación
  const isAuthRoute =
    path.startsWith('/login') || path.startsWith('/registro');

  const isKycRoute = path.startsWith('/kyc');

  // ── Lógica de Redirección y Roles ───────────────────────────
  const { data: profile } = user 
    ? await supabase.from('usuarios_plataforma').select('tipo_usuario, ciudadano_id').eq('auth_user_id', user.id).maybeSingle()
    : { data: null };

  const tipoUsuario = profile?.tipo_usuario;
  const ciudadanoId = profile?.ciudadano_id ?? user?.id;

  // 1. Protección de rutas de ADMINISTRACIÓN
  if (isProtectedAdmin) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
    // Verificar que sea empleado de gobierno
    if (tipoUsuario !== 'ADMIN_GOBIERNO' && tipoUsuario !== 'OPERADOR_GOBIERNO') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard'; // Redirigir ciudadanos al dashboard
      return NextResponse.redirect(url);
    }
  }

  // 2. Protección de rutas de CIUDADANO
  if (isProtectedCiudadano) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
    
    // Evitar que admins entren al dashboard de ciudadano (opcional, pero limpio)
    if (tipoUsuario === 'ADMIN_GOBIERNO' || tipoUsuario === 'OPERADOR_GOBIERNO') {
      if (!path.startsWith('/admin')) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    }

    // 3. Validación de KYC (Solo para ciudadanos)
    if (tipoUsuario === 'CIUDADANO' && !isKycRoute) {
      const { data: ciudadano } = await supabase
        .from('ciudadanos')
        .select('estado_kyc')
        .eq('id', ciudadanoId)
        .maybeSingle();

      const estadoKyc = ciudadano?.estado_kyc ?? 'Pendiente';

      // Redirigir a KYC si está Pendiente o Rechazado
      // Permitimos 'Verificado' y 'EnProceso' entrar al dashboard
      if (estadoKyc === 'Pendiente' || estadoKyc === 'Rechazado') {
        const url = request.nextUrl.clone();
        url.pathname = '/kyc';
        return NextResponse.redirect(url);
      }
    }
  }

  // 4. Redirección si ya está autenticado (Login/Registro)
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = (tipoUsuario === 'ADMIN_GOBIERNO' || tipoUsuario === 'OPERADOR_GOBIERNO') ? '/admin' : '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y rutas internas de Next.js
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
