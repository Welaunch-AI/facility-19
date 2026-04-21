"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useRef, useState } from "react";

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <path d="M12 18v3" />
    </svg>
  );
}


function PhoneOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 6.35 1.05 2 2 0 0 1 1.72 2v3.36a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 4h3.36a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 1.05 6.35 2 2 0 0 1-.45 2.11L8.76 15.32" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function Volume2Icon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VolumeXIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m22 9-6 6" />
      <path d="m16 9 6 6" />
    </svg>
  );
}


export function VoiceAgent() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearConnectTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const conversation = useConversation({
    onConnect: () => {
      clearConnectTimeout();
      setIsConnecting(false);
      setError(null);
    },
    onDisconnect: () => {
      clearConnectTimeout();
      setIsConnecting(false);
    },
    onError: (err) => {
      console.error("Conversation error:", err);
      clearConnectTimeout();
      setError(
        typeof err === "string" ? err : "Connection error. Please try again.",
      );
      setIsConnecting(false);
    },
  });

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  const start = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    timeoutRef.current = setTimeout(() => {
      setError("Connection timed out. Please try again.");
      setIsConnecting(false);
      void conversation.endSession();
    }, 10000);

    try {
      try {
        if (navigator.permissions) {
          const status = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });
          if (status.state === "denied") {
            throw new Error(
              "Microphone is blocked. Enable it in your browser settings (or open the published site directly).",
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
      clearConnectTimeout();
      console.error("Start failed:", err);
      let msg = "Failed to start. Check your microphone and try again.";
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          msg =
            "Microphone access denied. Allow it in your browser settings, then reload.";
        } else if (err.name === "NotFoundError") {
          msg = "No microphone found.";
        } else if (err.name === "NotReadableError") {
          msg = "Microphone is in use by another application.";
        } else if (err.message) {
          msg = err.message;
        }
      }
      setError(msg);
      setIsConnecting(false);
    }
  }, [conversation]);

  const stop = useCallback(async () => {
    clearConnectTimeout();
    await conversation.endSession();
  }, [conversation]);

  const handleVolumeChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value) / 100;
      setVolume(v);
      setMuted(v === 0);
      try {
        await conversation.setVolume({ volume: v });
      } catch {
        /* ignore */
      }
    },
    [conversation],
  );

  const toggleMute = useCallback(async () => {
    const next = !muted;
    setMuted(next);
    try {
      await conversation.setVolume({ volume: next ? 0 : volume || 0.8 });
    } catch {
      /* ignore */
    }
  }, [muted, volume, conversation]);

  const statusLabel = isConnecting
    ? "Connecting…"
    : isConnected
      ? isSpeaking
        ? "Agent speaking"
        : "Listening"
      : "Disconnected";

  const statusDotClass = isConnecting
    ? "bg-[#8EC5FF] animate-pulse"
    : isConnected
      ? isSpeaking
        ? "bg-[#2B6FD6] animate-pulse scale-110"
        : "bg-[#2B6FD6] animate-pulse"
      : "bg-[#8EC5FF]";

  const statusTextClass = "text-[15px] font-medium text-[#2B6FD6]";

  return (
    <div className="flex w-full flex-col items-center gap-12">
      <div className="relative flex h-[17.5rem] w-[17.5rem] items-center justify-center">
        {isConnected && isSpeaking && (
          <div
            className={cn(
              "absolute inset-2 rounded-full bg-slate-500/15 blur-2xl transition-all duration-500",
              "scale-100 opacity-90",
            )}
          />
        )}
        <button
          type="button"
          onClick={isConnected ? stop : start}
          disabled={isConnecting}
          aria-label={isConnected ? "End conversation" : "Start conversation"}
          className={cn(
            "relative flex h-44 w-44 items-center justify-center rounded-full text-white transition-transform duration-300",
            "bg-gradient-to-br from-[#4B5563] via-[#3F4A56] to-[#1E293B]",
            "shadow-[0_12px_28px_rgba(15,23,42,0.22),0_2px_6px_rgba(15,23,42,0.08)]",
            "focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#2B6FD6]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            "enabled:hover:scale-[1.02] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-85",
            isConnected && isSpeaking && "scale-[1.04]",
          )}
        >
          {isConnecting ? (
            <div
              className="h-11 w-11 rounded-full border-[3px] border-white/25 border-t-white animate-spin"
              aria-hidden
            />
          ) : isConnected ? (
            <PhoneOffIcon className="text-white" />
          ) : (
            <MicIcon className="text-white" />
          )}
        </button>
      </div>

      <div className="flex flex-col items-center gap-2.5 px-1">
        <div className="flex items-center gap-2.5">
          <span
            className={cn("h-2 w-2 shrink-0 rounded-full transition-colors", statusDotClass)}
            aria-hidden
          />
          <p className={statusTextClass}>{statusLabel}</p>
        </div>
        <p className="text-center text-sm leading-snug text-[#8B9BB8]">
          {isConnecting
            ? "Hang tight…"
            : isConnected
              ? "Tap the button to end the call"
              : "Tap the mic to start"}
        </p>
        {error && (
          <p className="max-w-[280px] text-center text-sm leading-snug text-[#C53030]">
            {error}
          </p>
        )}
      </div>

      {isConnected && (
        <div className="flex w-full max-w-[280px] items-center gap-3 border-t border-slate-200/90 pt-8">
          <button
            type="button"
            onClick={() => void toggleMute()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50"
            aria-label="Toggle mute"
          >
            {muted ? <VolumeXIcon /> : <Volume2Icon />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={muted ? 0 : Math.round(volume * 100)}
            onChange={(e) => void handleVolumeChange(e)}
            className="h-2 flex-1 cursor-pointer accent-[#2B6FD6]"
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
}

export function VoiceAgentHeader() {
  return (
    <header className="mb-14 flex w-full flex-col items-center text-center">
      <h1 className="sr-only">Facility19 — Talk to Aria</h1>
      <div className="mb-8 flex items-center justify-center gap-3">
        <img
          src="/favicon.png"
          alt=""
          className="h-12 w-12 shrink-0 object-contain md:h-14 md:w-14"
          width={56}
          height={56}
        />
        <div className="flex items-baseline gap-0.5 leading-none">
          <span className="text-[1.65rem] font-bold tracking-tight text-[#0A0A0B] md:text-[1.85rem]">
            Facility
          </span>
          <span className="text-[1.65rem] font-semibold tracking-tight text-[#2B6FD6] md:text-[1.85rem]">
            19
          </span>
        </div>
      </div>
      <p className="max-w-[340px] text-[0.95rem] font-medium leading-relaxed text-[#5A6D86] md:text-base">
        Tap the mic to start a real-time voice conversation.
      </p>
    </header>
  );
}
