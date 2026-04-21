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
      strokeWidth="1.75"
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
      strokeWidth="1.75"
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

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-10">
      <div className="relative flex h-64 w-64 items-center justify-center">
        {isConnected && (
          <>
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-[#6B7BFF]/20 blur-2xl transition-all duration-500",
                isSpeaking ? "scale-110 opacity-100" : "scale-90 opacity-60",
              )}
            />
            <div
              className={cn(
                "absolute inset-4 rounded-full bg-[#6B7BFF]/30 transition-transform duration-700",
                isSpeaking ? "scale-105 animate-pulse" : "scale-100",
              )}
            />
          </>
        )}
        <button
          type="button"
          onClick={isConnected ? stop : start}
          disabled={isConnecting}
          aria-label={isConnected ? "End conversation" : "Start conversation"}
          className={cn(
            "relative flex h-40 w-40 items-center justify-center rounded-full shadow-2xl transition-all duration-500",
            "bg-gradient-to-br from-[#6B7BFF] to-[#3D4DDB] text-white",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#6B7BFF]/40",
            "hover:scale-105 active:scale-95 disabled:cursor-not-allowed",
            isConnected && isSpeaking && "scale-110",
            !isConnected && "opacity-95",
          )}
        >
          {isConnecting ? (
            <div
              className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin"
              aria-hidden
            />
          ) : isConnected ? (
            <PhoneOffIcon className="text-white" />
          ) : (
            <MicIcon className="text-white" />
          )}
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              isConnected ? "animate-pulse bg-[#1F8A5F]" : "bg-[#8A8F9C]/50",
            )}
          />
          <p className="text-sm font-medium text-[#5E6472]">{statusLabel}</p>
        </div>
        <p className="text-center text-xs text-[#8A8F9C]">
          {isConnecting
            ? "Hang tight…"
            : isConnected
              ? "Tap the orb to end"
              : "Tap the mic to start"}
        </p>
        {error && (
          <p className="max-w-xs text-center text-sm text-[#C0392B]">{error}</p>
        )}
      </div>

      {isConnected && (
        <div className="flex w-full max-w-xs items-center gap-3">
          <button
            type="button"
            onClick={() => void toggleMute()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#DAD8D0] bg-white text-[#0A0A0B] transition-colors hover:bg-[#F3F3EF]"
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
            className="h-2 flex-1 cursor-pointer accent-[#3D4DDB]"
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
}

export function VoiceAgentHeader() {
  return (
    <header className="mb-12 text-center">
      <h1 className="sr-only">Facility19 — Talk to Aria</h1>
      <img
        src="/favicon.png"
        alt="Facility19"
        className="mx-auto mb-4 h-16 w-auto md:h-20"
        width={160}
        height={160}
      />
      <p className="mx-auto max-w-md text-[#5E6472]">
        Tap the mic to start a real-time voice conversation.
      </p>
    </header>
  );
}
