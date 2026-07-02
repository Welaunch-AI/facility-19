import type { CSSProperties } from "react";

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-[3px]",
} as const;

type LoadingSpinnerProps = {
  size?: keyof typeof sizes;
  className?: string;
  style?: CSSProperties;
};

export function LoadingSpinner({
  size = "sm",
  className = "",
  style,
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block shrink-0 animate-spin rounded-full border-[#E5E4DE] border-t-[#6B7BFF] ${sizes[size]} ${className}`}
      style={style}
    />
  );
}

type LoadingInlineProps = {
  label?: string;
  size?: keyof typeof sizes;
  className?: string;
};

export function LoadingInline({
  label,
  size = "sm",
  className = "",
}: LoadingInlineProps) {
  return (
    <span className={`inline-flex items-center justify-center gap-2 ${className}`}>
      <LoadingSpinner size={size} />
      {label ? <span>{label}</span> : null}
    </span>
  );
}

type LoadingPanelProps = {
  label: string;
  className?: string;
};

export function LoadingPanel({ label, className = "" }: LoadingPanelProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-12 text-center ${className}`}
    >
      <LoadingSpinner size="lg" />
      <p className="text-[15px] text-[#5E6472]">{label}</p>
    </div>
  );
}
