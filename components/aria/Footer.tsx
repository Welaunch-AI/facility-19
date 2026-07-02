"use client";

import { useEffect, useState } from "react";

function formatEST(d: Date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/New_York",
    }).format(d);
  } catch {
    return d.toISOString().slice(11, 19);
  }
}

export function AriaFooter({ connected }: { connected: boolean }) {
  const [time, setTime] = useState(() => formatEST(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatEST(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-slate-400">
      <span>Channel</span>
      <span>·</span>
      <span>WSS</span>
      <span>·</span>
      <span>EST {time}</span>
      <span>·</span>
      <span className="inline-flex items-center gap-1.5">
        {connected && <span className="aria-live-dot" />}
        {connected ? "Live" : "Standby"}
      </span>
    </div>
  );
}
