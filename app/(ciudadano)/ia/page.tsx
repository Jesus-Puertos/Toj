'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { Route } from 'next';

// ── Tipos ────────────────────────────────────────────────────────────────────
type Rol = 'user' | 'assistant';
interface Mensaje {
  id: string;
  rol: Rol;
  texto: string;
  hora: string;
  loading?: boolean;
}

// ── Quick chips (sugerencias rápidas) ─────────────────────────────────────────
const CHIPS = [
  { texto: '¿Cuánto debo de predial?', icono: 'account_balance' },
  { texto: '¿Cómo pago con STP?', icono: 'payments' },
  { texto: '¿Qué es el KYC?', icono: 'verified_user' },
  { texto: '¿Tengo descuento por pronto pago?', icono: 'local_offer' },
];

// ── Burbuja del Bot ───────────────────────────────────────────────────────────
function BurbujaBot({ mensaje }: { mensaje: Mensaje }) {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shrink-0 mb-1">
        <span className="material-symbols-outlined text-on-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
        {mensaje.loading ? (
          <div className="flex items-center gap-1.5 py-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        ) : (
          <>
            <p className="text-body-sm text-on-surface leading-relaxed whitespace-pre-wrap">{mensaje.texto}</p>
            <p className="text-on-surface-variant text-[11px] mt-2">{mensaje.hora}</p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Burbuja del Usuario ───────────────────────────────────────────────────────
function BurbujaUser({ mensaje }: { mensaje: Mensaje }) {
  return (
    <div className="flex justify-end">
      <div className="bg-primary text-on-primary rounded-2xl rounded-tr-sm p-4 max-w-[80%]">
        <p className="text-body-sm leading-relaxed">{mensaje.texto}</p>
        <div className="flex items-center justify-end gap-1 mt-2">
          <p className="text-on-primary/70 text-[11px]">{mensaje.hora}</p>
          <span className="text-on-primary/70 text-[11px]">✓✓</span>
        </div>
      </div>
    </div>
  );
}

// ── Página Principal ──────────────────────────────────────────────────────────
export default function IAPage() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: 'welcome',
      rol: 'assistant',
      texto: '¡Hola! Soy el asistente inteligente de TOJ 🏛️\n\nEstoy aquí para ayudarte con tus obligaciones fiscales del municipio: predial, agua, licencias y más. También puedo orientarte sobre cómo pagar, qué es el KYC y cómo funciona tu wallet.\n\n¿En qué te puedo ayudar hoy? 😊',
      hora: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hora = () => new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => { scrollToBottom(); }, [mensajes, scrollToBottom]);

  const enviarMensaje = async (texto: string) => {
    if (!texto.trim() || isLoading) return;
    setShowChips(false);
    setInput('');
    setIsLoading(true);

    const userMsg: Mensaje = { id: Date.now().toString(), rol: 'user', texto: texto.trim(), hora: hora() };
    const loadingId = `loading-${Date.now()}`;
    const loadingMsg: Mensaje = { id: loadingId, rol: 'assistant', texto: '', hora: hora(), loading: true };

    setMensajes((prev) => [...prev, userMsg, loadingMsg]);

    try {
      // Construir historial para la API
      const historial = mensajes
        .filter((m) => !m.loading && m.id !== 'welcome')
        .map((m) => ({ role: m.rol === 'user' ? 'user' : 'assistant', content: m.texto }));

      historial.push({ role: 'user', content: texto.trim() });

      const res = await fetch('/api/ia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historial }),
      });

      if (!res.ok) throw new Error('Error en la respuesta del servidor');

      // Procesar stream SSE de OpenAI
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let respuestaCompleta = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

          for (const line of lines) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') break;
            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta?.content ?? '';
              if (delta) {
                respuestaCompleta += delta;
                // Actualizar el mensaje en tiempo real (streaming)
                setMensajes((prev) =>
                  prev.map((m) =>
                    m.id === loadingId
                      ? { ...m, texto: respuestaCompleta, loading: false }
                      : m
                  )
                );
              }
            } catch {
              // Ignorar líneas malformadas del stream
            }
          }
        }
      }

      // Si no hubo contenido, fallback
      if (!respuestaCompleta) {
        setMensajes((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { ...m, texto: 'Lo siento, ocurrió un error. Intenta de nuevo.', loading: false }
              : m
          )
        );
      }
    } catch (err) {
      console.error(err);
      setMensajes((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, texto: 'No pude conectarme al servidor. Verifica tu conexión e intenta de nuevo. 🔌', loading: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje(input);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-surface z-10 px-5 py-3 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <Link href={'/dashboard' as Route} aria-label="Regresar">
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">arrow_back</span>
          </Link>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-on-surface text-body-md leading-tight">TOJ Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-label-caps text-green-500 font-bold tracking-widest text-[10px]">EN LÍNEA • POWERED BY GPT-4o</p>
            </div>
          </div>
          <button aria-label="Información" className="w-9 h-9 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[22px]">info</span>
          </button>
        </div>
      </header>

      {/* Mensajes */}
      <div ref={scrollRef} className="flex-1 px-4 py-5 space-y-4 overflow-y-auto" style={{ paddingBottom: 'calc(68px + 80px)' }}>
        <div className="text-label-caps text-on-surface-variant bg-surface-container rounded-full px-4 py-1 mx-auto w-fit tracking-widest text-center">
          HOY
        </div>

        {mensajes.map((msg) =>
          msg.rol === 'assistant'
            ? <BurbujaBot key={msg.id} mensaje={msg} />
            : <BurbujaUser key={msg.id} mensaje={msg} />
        )}

        {/* Quick chips (solo al inicio) */}
        {showChips && (
          <div className="ml-12 space-y-2">
            <p className="text-label-caps text-on-surface-variant font-bold tracking-widest">PREGUNTAS FRECUENTES</p>
            <div className="flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip.texto}
                  onClick={() => enviarMensaje(chip.texto)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2.5 text-body-sm text-on-surface hover:bg-surface-container hover:border-primary transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>{chip.icono}</span>
                  {chip.texto}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-[68px] left-0 right-0 max-w-[430px] mx-auto bg-surface border-t border-outline-variant px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-2 focus-within:border-primary transition-colors gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none disabled:opacity-50"
            />
            {input && (
              <button onClick={() => setInput('')} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          <button
            onClick={() => enviarMensaje(input)}
            disabled={!input.trim() || isLoading}
            aria-label="Enviar"
            className="w-11 h-11 bg-primary rounded-full flex items-center justify-center shrink-0 hover:bg-primary/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-on-primary text-[18px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-on-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            )}
          </button>
        </div>
        <p className="text-center text-[10px] text-on-surface-variant/50 mt-2">
          IA puede cometer errores. Verifica información fiscal con el municipio.
        </p>
      </div>
    </div>
  );
}