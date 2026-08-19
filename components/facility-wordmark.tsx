/** Shared WeLaunch wordmark used across app-shell pages. */
import { WeLaunchLogo } from "@/components/welaunch-logo";
import { WELAUNCH_MARK_BLACK } from "@/lib/welaunch-brand";

export const FACILITY_MARK_SRC = WELAUNCH_MARK_BLACK;

type FacilityWordmarkProps = {
  size?: number;
  className?: string;
};

export function FacilityWordmark({
  size = 22,
  className = "",
}: FacilityWordmarkProps) {
  return (
    <span className={`facility-wordmark ${className}`.trim()}>
      <WeLaunchLogo height={size} className="facility-wordmark-icon" />
    </span>
  );
}
