"use client";

import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, Pause, Play, X } from "lucide-react";
import { Orb } from "@/components/aria/Orb";
import { ChatPanel, type AriaMessage } from "@/components/aria/ChatPanel";
import { AriaHeader } from "@/components/aria/Header";
import { AriaFooter } from "@/components/aria/Footer";

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function ControlButton({
  children,
  label,
  onClick,
  active,
  activeColor,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-slate-900"
      style={
        active
          ? {
              background: activeColor ?? "#2b6dff",
              color: "white",
              boxShadow: `0 10px 24px -10px ${activeColor ?? "#2b6dff"}80`,
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}

function AriaConsoleInner() {
  const [messages, setMessages] = useState<AriaMessage[]>([]);
  const [paused, setPaused] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(0);

  const pushMessage = useCallback((role: "aria" | "user", text: string) => {
    idRef.current += 1;
    setMessages((prev) => [...prev, { id: `m${idRef.current}`, role, text }]);
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      setIsConnecting(false);
      setError(null);
    },
    onDisconnect: () => {
      setIsConnecting(false);
      setPaused(false);
    },
    onMessage: ({ message, source }: { message: string; source: "user" | "ai" }) => {
      pushMessage(source === "ai" ? "aria" : "user", message);
    },
    onError: (err: unknown) => {
      console.error("[Aria]", err);
      setIsConnecting(false);
      setError(typeof err === "string" ? err : "Voice session error. Please try again.");
    },
  });

  const connected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;
  const isMuted = conversation.isMuted ?? false;

  const orbState: "idle" | "listening" | "speaking" | "paused" = useMemo(() => {
    if (!connected) return "idle";
    if (paused) return "paused";
    if (isSpeaking) return "speaking";
    return "listening";
  }, [connected, paused, isSpeaking]);

  const statusLine = useMemo(() => {
    if (!connected && !isConnecting) return "Speak — Aria is ready.";
    if (isConnecting) return "Connecting…";
    if (paused) return "Paused";
    if (isSpeaking) return "Aria is speaking…";
    return "Aria is listening…";
  }, [connected, isConnecting, paused, isSpeaking]);

  const typing = connected && isSpeaking && messages[messages.length - 1]?.role !== "aria";

  const start = useCallback(async () => {
    if (isConnecting || connected) return;
    setError(null);
    setIsConnecting(true);

    try {
      try {
        if (navigator.permissions) {
          const status = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });
          if (status.state === "denied") {
            throw new Error(
              "Microphone is blocked. Enable it in your browser settings.",
            );
          }
        }
      } catch (permErr) {
        if (
          permErr instanceof Error &&
          permErr.message.startsWith("Microphone is blocked")
        ) {
          throw permErr;
        }
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });

      const tokenRes = await fetch("/api/elevenlabs-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await tokenRes.json()) as {
        signedUrl?: string;
        error?: string;
      };

      if (!tokenRes.ok) {
        throw new Error(data?.error || "Failed to get conversation token.");
      }
      if (!data.signedUrl) {
        throw new Error(data?.error || "No signed URL returned from server.");
      }

      await conversation.startSession({
        signedUrl: data.signedUrl,
        connectionType: "websocket",
      });
    } catch (err) {
      setIsConnecting(false);
      console.error("Start failed:", err);
      let msg = "Failed to start. Check your microphone and try again.";
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          msg = "Microphone access denied. Allow it in your browser settings, then reload.";
        } else if (err.name === "NotFoundError") {
          msg = "No microphone found.";
        } else if (err.name === "NotReadableError") {
          msg = "Microphone is in use by another application.";
        } else if (err.message) {
          msg = err.message;
        }
      }
      setError(msg);
    }
  }, [conversation, connected, isConnecting]);

  const end = useCallback(async () => {
    await conversation.endSession();
    setPaused(false);
  }, [conversation]);

  const toggleMute = useCallback(() => {
    try {
      conversation.setMuted(!isMuted);
    } catch (e) {
      console.error(e);
    }
  }, [conversation, isMuted]);

  const togglePause = useCallback(() => {
    try {
      if (paused) {
        conversation.setMuted(false);
        setPaused(false);
      } else {
        conversation.setMuted(true);
        setPaused(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [conversation, paused]);

  useEffect(() => {
    return () => {
      if (conversation.status === "connected") {
        void conversation.endSession();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="aria-bg relative flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 sm:px-10">
        <AriaHeader />
        {connected && (
          <button
            onClick={() => void end()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-800"
            aria-label="End session"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </header>

      {/* Main */}
      <main className="relative flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
        <div
          className={cn(
            "grid w-full max-w-7xl gap-8 transition-all duration-500 ease-out",
            connected
              ? "grid-cols-1 md:grid-cols-[1fr_minmax(0,520px)] lg:grid-cols-[1fr_minmax(0,600px)]"
              : "grid-cols-1",
          )}
        >
          {/* Orb column */}
          <div className="flex flex-col items-center justify-center gap-8">
            <Orb state={orbState} size={connected ? 320 : 380} />
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="font-serif-display text-2xl font-medium text-slate-800 sm:text-[28px]">
                {statusLine}
              </div>
              {!connected && !isConnecting && (
                <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-slate-400">
                  Voice Intelligence · Always On
                </div>
              )}
              {error && (
                <p className="max-w-[300px] text-center text-sm leading-snug text-red-600">
                  {error}
                </p>
              )}
              {!connected ? (
                <button
                  onClick={() => void start()}
                  disabled={isConnecting}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-[#2b6dff] shadow-[0_10px_30px_-10px_rgba(43,109,255,0.4)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-10px_rgba(43,109,255,0.5)] disabled:opacity-60"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {isConnecting ? "Connecting…" : "Start"}
                </button>
              ) : (
                <div className="mt-2 flex items-center gap-3">
                  <ControlButton
                    label={isMuted ? "Unmute" : "Mute"}
                    active={isMuted}
                    activeColor="#ff5a3c"
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </ControlButton>
                  <ControlButton
                    label={paused ? "Resume" : "Pause"}
                    active={paused}
                    onClick={togglePause}
                  >
                    {paused ? (
                      <Play className="h-4 w-4 fill-current" />
                    ) : (
                      <Pause className="h-4 w-4 fill-current" />
                    )}
                  </ControlButton>
                  <ControlButton label="End" onClick={() => void end()} activeColor="#ff5a3c" active>
                    <X className="h-4 w-4" />
                  </ControlButton>
                </div>
              )}
            </div>
          </div>

          {/* Chat panel */}
          {connected && (
            <div className="h-[520px] animate-in slide-in-from-right-8 fade-in duration-500 md:h-[600px]">
              <ChatPanel
                messages={messages}
                typing={typing}
                disabled={!connected}
                onSend={(text) => {
                  pushMessage("user", text);
                  try { (conversation as unknown as { sendUserMessage: (t: string) => void }).sendUserMessage(text); } catch { /* noop */ }
                }}
                onActivity={() => {
                  try { (conversation as unknown as { sendUserActivity: () => void }).sendUserActivity(); } catch { /* noop */ }
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-6 sm:px-10">
        <AriaFooter connected={connected} />
      </footer>

      {/* Back to website link */}
      <a
        href="/"
        className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-md sm:left-10"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to website
      </a>
    </div>
  );
}

export function VoiceAgent() {
  const [mounted, setMounted] = useState(false);
  const [, forceRender] = useState(0);

  useEffect(() => {
    setMounted(true);
    forceRender((n) => n + 1);
  }, []);

  if (!mounted) {
    return <div className="aria-bg min-h-screen" />;
  }

  return (
    <ConversationProvider>
      <AriaConsoleInner />
    </ConversationProvider>
  );
}

export function VoiceAgentHeader() {
  return null;
}
