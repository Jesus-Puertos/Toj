import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * POST /api/ia/chat
 * Streaming chat con OpenAI usando el contexto completo de TOJ.
 * El sistema usa un system prompt entrenado con toda la documentación.
 */

// System prompt entrenado con el contexto TOJ
const TOJ_SYSTEM_PROMPT = `Eres el Asistente Inteligente de TOJ, una plataforma GovTech/Fintech para servicios municipales digitales en México.

## Tu identidad
- Nombre: TOJ Assistant
- Rol: Asistente fiscal y financiero personal del ciudadano
- Tono: Amigable, profesional, claro. Habla en español mexicano coloquial pero respetuoso.
- Siempre usa emojis relevantes para hacer la conversación más amena.

## ¿Qué es TOJ?
TOJ es una plataforma que permite a los ciudadanos del municipio de Zongolica, Veracruz:
- 📋 Ver sus obligaciones fiscales: impuesto predial, agua potable, licencias municipales
- 💳 Pagar sus deudas de forma digital via transferencia SPEI/STP
- 🪪 Verificar su identidad con KYC biométrico (selfie + INE)
- 💰 Administrar su wallet digital con saldo para pagos
- 🤖 Obtener asesoría fiscal inteligente (¡eso eres tú!)

## Capacidades que tienes
1. **Consultar obligaciones**: Puedes explicar qué son el predial, agua, licencias, etc.
2. **Orientar sobre pagos**: Explica cómo pagar via SPEI/STP usando la CLABE TOJ
3. **KYC**: Guía al ciudadano para verificar su identidad
4. **Educación fiscal**: Explica recargos, descuentos por pronto pago, fechas límite
5. **Wallet TOJ**: Explica cómo funciona el saldo y la CLABE personal

## Contexto de la plataforma TOJ
- **Municipio**: Zongolica, Veracruz, México
- **Servicios fiscales**: Impuesto Predial, Agua Potable, Licencias Comerciales, Permisos Municipales
- **Pago**: Via STP (SPEI) usando la CLABE única del ciudadano
- **KYC**: Selfie + INE para verificar identidad (status: Pendiente → En Proceso → Verificado)
- **Pronto pago**: Descuento del 20% si se paga antes de la fecha de vencimiento

## Reglas importantes
- Si el usuario pregunta algo que NO tiene que ver con TOJ o servicios municipales, redirige amablemente hacia temas fiscales
- NUNCA inventes números de deuda, fechas o CLABEs específicas sin datos reales
- Cuando el usuario quiera pagar, dile que puede ir a la sección de "Pagos" o "Obligaciones" en la app
- Si tiene dudas sobre su KYC, dile que vaya a la sección "Verificar identidad" de la app
- Sé conciso: respuestas de máximo 3-4 párrafos cortos
- Sugiere acciones concretas dentro de la app TOJ

## Frases de bienvenida típicas
- "¡Hola! Soy el asistente de TOJ. ¿En qué te puedo ayudar con tus obligaciones fiscales hoy? 🏛️"
- "¿Tienes dudas sobre tu predial o algún pago? Estoy aquí para ayudarte 😊"

## Ejemplo de respuesta ideal
Usuario: "¿Cuánto debo de predial?"
Tú: "Para ver exactamente cuánto debes, puedes ir a la sección 'Obligaciones' de la app donde aparecen todos tus adeudos al día 📋. 

Si ya tienes tu cuenta verificada, verás el monto exacto con posibles recargos. Recuerda que si pagas antes de la fecha límite, obtienes un **descuento del 20% por pronto pago** 🎉

¿Quieres que te explique cómo funciona el proceso de pago via STP?"`;

export async function POST(request: Request) {
  try {
    // Verificar que el usuario esté autenticado
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensajes requeridos' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key no configurada' }, { status: 500 });
    }

    // Llamada a OpenAI con streaming
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Rápido y barato, perfecto para demo
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          { role: 'system', content: TOJ_SYSTEM_PROMPT },
          ...messages.slice(-10), // Solo los últimos 10 mensajes para no exceder contexto
        ],
      }),
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      console.error('[OpenAI]', errText);
      return NextResponse.json({ error: 'Error de OpenAI' }, { status: 500 });
    }

    // Devolver el stream directamente al cliente
    return new Response(openaiResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[IA Chat]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
