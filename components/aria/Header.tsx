"use client";

export function AriaHeader() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          background: "linear-gradient(135deg, #1e2a4a 0%, #2b3f6b 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.15), 0 6px 14px -6px rgba(30,42,74,0.5)",
        }}
      >
        <img
          src="/favicon.png"
          alt="Facility19"
          className="h-6 w-6 object-contain"
          style={{ filter: "brightness(0) invert(1)" }}
          width={24}
          height={24}
        />
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-bold tracking-tight">
          <span style={{ color: "#0a0a12" }}>Facility</span>
          <span style={{ color: "#2b6dff" }}>19</span>
        </div>
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
          Aria · Voice Operations
        </div>
      </div>
    </div>
  );
}
