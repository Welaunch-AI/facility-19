import { LoadingSpinner } from "@/components/loading-spinner";

type TransitionOverlayProps = {
  label?: string;
};

export function TransitionOverlay({ label }: TransitionOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#FAFAF8]/88 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-5 px-6 text-center">
        <LoadingSpinner size="lg" />
        {label ? (
          <p className="max-w-xs font-mono text-[11px] uppercase tracking-[0.12em] text-[#5E6472]">
            {label}
          </p>
        ) : null}
      </div>
    </div>
  );
}
