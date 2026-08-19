import {
  WELAUNCH_MARK_BLACK,
  WELAUNCH_MARK_WHITE,
  WELAUNCH_WORDMARK_BLACK,
  WELAUNCH_WORDMARK_WHITE,
} from "@/lib/welaunch-brand";

type WeLaunchLogoProps = {
  variant?: "wordmark" | "mark";
  color?: "black" | "white";
  height?: number;
  className?: string;
};

const SRC = {
  wordmark: {
    black: WELAUNCH_WORDMARK_BLACK,
    white: WELAUNCH_WORDMARK_WHITE,
  },
  mark: {
    black: WELAUNCH_MARK_BLACK,
    white: WELAUNCH_MARK_WHITE,
  },
} as const;

export function WeLaunchLogo({
  variant = "wordmark",
  color = "black",
  height = 24,
  className = "",
}: WeLaunchLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC[variant][color]}
      alt="WeLaunch"
      height={height}
      className={className}
      style={{ height, width: "auto", display: "block" }}
    />
  );
}
