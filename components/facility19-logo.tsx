import { FACILITY19_WORDMARK } from "@/lib/facility19-brand";

type Facility19LogoProps = {
  height?: number;
  className?: string;
};

export function Facility19Logo({
  height = 24,
  className = "",
}: Facility19LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={FACILITY19_WORDMARK}
      alt="Facility19"
      height={height}
      className={className}
      style={{ height, width: "auto", display: "block" }}
    />
  );
}
