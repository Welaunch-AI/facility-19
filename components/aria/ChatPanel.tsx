"use client";

import { useEffect, useRef, useState } from "react";

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export interface AriaMessage {
  id: string;
  role: "aria" | "user";
  text: string;
}

interface ChatPanelProps {
  messages: AriaMessage[];
  typing: boolean;
  disabled: boolean;
  onSend: (text: string) => void;
  onActivity: () => void;
}

export function ChatPanel({ messages, typing, disabled, onSend, onActivity }: ChatPanelProps) {
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const submit = () => {
    const t = value.trim();
    if (!t || disabled) return;
    onSend(t);
    setValue("");
  };

  return (
    <div className="flex h-full flex-col rounded-l-3xl bg-white/85 shadow-[0_20px_60px_-30px_rgba(30,42,74,0.35)] backdrop-blur-md">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Aria
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex flex-col gap-1",
              m.role === "user" ? "items-end" : "items-start",
            )}
          >
            <div
              className={cn(
                "text-[9px] font-semibold uppercase tracking-[0.24em]",
                m.role === "user" ? "text-[#2b6dff]" : "text-slate-400",
              )}
            >
              {m.role === "user" ? "You" : "Aria"}
            </div>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                m.role === "user"
                  ? "bg-[#2b6dff] text-white"
                  : "bg-white text-slate-800 ring-1 ring-slate-100",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex flex-col items-start gap-1">
            <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Aria
            </div>
            <div className="aria-typing rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-slate-100 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 ring-1 ring-slate-100 focus-within:ring-[#2b6dff]/40"
        >
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onActivity();
            }}
            placeholder={disabled ? "Connect to chat…" : "Message Aria…"}
            disabled={disabled}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2b6dff] text-white transition hover:bg-[#1e57e0] disabled:opacity-40"
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
