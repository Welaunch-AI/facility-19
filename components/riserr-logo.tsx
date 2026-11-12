import { RISERR_WORDMARK } from "@/lib/riserr-brand";

type RiserrLogoProps = {
  height?: number;
  className?: string;
};

export function RiserrLogo({
  height = 24,
  className = "",
}: RiserrLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={RISERR_WORDMARK}
      alt="Riserr"
      height={height}
      className={className}
      style={{ height, width: "auto", display: "block" }}
    />
  );
}
