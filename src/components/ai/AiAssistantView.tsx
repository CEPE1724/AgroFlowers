import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { askAssistant, SUGGESTED_QUESTIONS } from '@/services/aiService';
import { ChatMessageBubble } from './ChatMessageBubble';
import { Button } from '@/components/common/Button';
import type { ChatMessage } from '@/types/ai';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hola, soy el asistente de AgroFlowers AI. Puedo ayudarte a analizar rentabilidad, costos y desempeño de fincas. Elige una pregunta sugerida o escribe la tuya.',
  createdAt: Date.now(),
};

export function AiAssistantView() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isThinking]);

  async function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isThinking) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: trimmed, createdAt: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await askAssistant(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: response.content, isWarning: response.isWarning, createdAt: Date.now() },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    sendQuestion(input);
  }

  function handleClear() {
    setMessages([WELCOME_MESSAGE]);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
      <div className="card flex h-[600px] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-primary-100 px-4 py-3 dark:border-primary-900/40">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-900 dark:text-primary-50">Asistente de rentabilidad</p>
              <p className="text-xs text-gray-500 dark:text-primary-400">Analiza costos, ventas y desempeño de fincas</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" leftIcon={<Trash2 className="h-4 w-4" />} onClick={handleClear}>
            Limpiar conversación
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-primary-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analizando información...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-primary-100 p-3 dark:border-primary-900/40">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta sobre rentabilidad, costos o fincas..."
            className="input-base flex-1"
            disabled={isThinking}
          />
          <Button type="submit" leftIcon={<Send className="h-4 w-4" />} isLoading={isThinking} disabled={!input.trim()}>
            Enviar
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="card p-4">
          <h3 className="mb-3 text-sm font-semibold text-primary-900 dark:text-primary-50">Preguntas sugeridas</h3>
          <div className="flex flex-col gap-2">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => sendQuestion(question)}
                disabled={isThinking}
                className="rounded-lg border border-primary-100 px-3 py-2 text-left text-xs text-primary-700 transition-colors hover:border-primary-300 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary-900/40 dark:text-primary-200 dark:hover:bg-primary-900/30"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="card flex items-start gap-2 p-4">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-xs text-gray-500 dark:text-primary-400">
            Las respuestas del asistente son recomendaciones generadas a partir de los datos disponibles en el sistema;
            deben validarse antes de tomar decisiones comerciales.
          </p>
        </div>
      </div>
    </div>
  );
}
