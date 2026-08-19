"use client";

import { WeLaunchLogo } from "@/components/welaunch-logo";

export function AriaHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="leading-tight">
        <WeLaunchLogo height={20} />
        <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
          Aria · Voice Operations
        </div>
      </div>
    </div>
  );
}
