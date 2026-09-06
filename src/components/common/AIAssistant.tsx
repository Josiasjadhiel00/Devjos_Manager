import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { auth } from '../../lib/firebase';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const AIAssistant: React.FC = () => {
  const { currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending]);

  // El asistente es solo para el equipo, nunca para clientes del portal.
  if (!currentUser || currentUser.role === 'Cliente') return null;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    setError(null);
    setInput('');
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', text }];
    setMessages(nextMessages);
    setIsSending(true);

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const doRequest = () =>
        fetch('/api/assistant/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            message: text,
            history: nextMessages.slice(0, -1).slice(-10),
          }),
        });

      let res = await doRequest();
      // El modelo de IA a veces está temporalmente saturado (503) — se
      // reintenta una vez sola antes de mostrar un error al usuario.
      if (res.status === 503) {
        await new Promise(r => setTimeout(r, 1200));
        res = await doRequest();
      }
      const data = await res.json();
      if (!res.ok) {
        const rawMessage = data?.error || '';
        const friendly = rawMessage.includes('UNAVAILABLE') || rawMessage.includes('high demand')
          ? 'El asistente está saturado en este momento. Intenta de nuevo en unos segundos.'
          : rawMessage || 'No se pudo contactar al asistente.';
        throw new Error(friendly);
      }
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (err: any) {
      setError(err?.message || 'No se pudo contactar al asistente. Intenta de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-[#168dda] via-[#7a3fc4] to-[#1bb7e8] shadow-lg shadow-purple-500/30 flex items-center justify-center text-white hover:scale-105 transition-transform"
          title="Asistente DevJos"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Panel de chat */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 z-40 w-full h-full sm:w-96 sm:h-[560px] sm:max-h-[80vh] bg-slate-900 sm:border sm:border-slate-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 p-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#168dda] via-[#7a3fc4] to-[#1bb7e8] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">Asistente DevJos</h3>
                <p className="text-[11px] text-slate-400 truncate">Basado en tus datos reales del estudio</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 text-xs mt-6 space-y-2">
                <p>Pregúntame sobre tus tareas, cifras del estudio (si tu rol lo permite), o pídeme ayuda para redactar algo.</p>
                <p className="text-slate-600">Ej: "¿Qué tareas tengo pendientes?" · "Redáctame un mensaje de seguimiento para un cliente"</p>
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-sm'
                      : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                </div>
              </div>
            )}
            {error && (
              <p className="text-[11px] text-rose-400 text-center">{error}</p>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Escribe tu pregunta..."
              rows={1}
              className="flex-1 resize-none max-h-24 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
            />
            <button
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
