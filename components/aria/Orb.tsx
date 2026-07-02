"use client";

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

interface OrbProps {
  state: "idle" | "listening" | "speaking" | "paused";
  size?: number;
}

export function Orb({ state, size = 380 }: OrbProps) {
  return (
    <div
      className={cn("aria-orb", state)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="blob" />
    </div>
  );
}
