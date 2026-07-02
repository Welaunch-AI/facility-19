export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/roi-dashboard/facility19-logo.png"
        alt="Facility19"
        className="h-7 w-7 object-contain"
      />
      <span className="text-[19px] font-bold tracking-tight">
        Facility<span className="text-primary">19</span>
      </span>
    </div>
  );
}
