'use client';

import { X, Bot, Send, User, Sparkles } from 'lucide-react';
import type { PageConfig } from '@baazarify/storefront-builder';
import { useRef, useState, useEffect, useCallback } from 'react';

import { apiRequest } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  onGenerated: (config: PageConfig) => void;
}

export function AIChat({ onGenerated }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || loading) return;

      const userMessage: Message = { role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setExpanded(true);
      setLoading(true);

      try {
        const response = await apiRequest<{ data: PageConfig }>(
          '/stores/me/landing-page/generate',
          {
            method: 'POST',
            body: JSON.stringify({ businessType: trimmed }),
          }
        );

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Done! I have updated your landing page.' },
        ]);
        onGenerated(response.data);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: err.message || 'Sorry, something went wrong. Please try again.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, onGenerated]
  );

  const handleClear = useCallback(() => {
    setMessages([]);
    setExpanded(false);
  }, []);

  return (
    <div className="flex flex-col border-t border-[var(--grey-200)] bg-white/90 backdrop-blur-xl">
      {/* Chat thread */}
      {expanded && messages.length > 0 && (
        <div className="max-h-[220px] overflow-y-auto thin-scroll px-5 pt-4 pb-2">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <div
                className="flex h-5 w-5 items-center justify-center rounded-md"
                style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, white)' }}
              >
                <Sparkles size={10} className="text-[var(--color-primary)]" />
              </div>
              <span className="text-[0.6875rem] font-bold text-[var(--grey-500)] uppercase tracking-wider">
                AI Assistant
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md p-1 text-[var(--grey-400)] transition-colors hover:bg-[var(--grey-100)] hover:text-[var(--grey-600)]"
            >
              <X size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, white)' }}
                  >
                    <Bot size={12} className="text-[var(--color-primary)]" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-[0.8125rem] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[var(--grey-900)] text-white rounded-br-md'
                      : 'bg-[var(--grey-100)] text-[var(--grey-800)] rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]">
                    <User size={12} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'color-mix(in srgb, var(--color-primary) 15%, white)' }}
                >
                  <Bot size={12} className="text-[var(--color-primary)]" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-[var(--grey-100)] px-4 py-2.5">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--grey-400)] animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--grey-400)] animate-bounce [animation-delay:0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--grey-400)] animate-bounce [animation-delay:0.3s]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-3">
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px]"
          style={{
            background: 'linear-gradient(135deg, var(--primary-main), var(--warning-main))',
          }}
        >
          <Sparkles size={14} className="text-white" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your page — e.g. 'A modern clothing store with hero banner'"
          disabled={loading}
          className="flex-1 rounded-[12px] border border-[var(--grey-200)] bg-[var(--grey-50)] px-4 py-2.5 text-[0.875rem] text-[var(--grey-900)] placeholder:text-[var(--grey-400)] transition-all focus:border-[var(--color-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[12px] text-white shadow-sm transition-all hover:shadow-md disabled:opacity-30 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, var(--primary-main), var(--warning-main))',
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
