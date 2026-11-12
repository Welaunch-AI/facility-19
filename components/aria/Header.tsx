"use client";

import { RiserrLogo } from "@/components/riserr-logo";

export function AriaHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="leading-tight">
        <RiserrLogo height={28} />
        <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
          Aria · Voice Operations
        </div>
      </div>
    </div>
  );
}
