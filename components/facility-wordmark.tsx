/** Same mark + wordmark as the main landing page header (`public/facility`). */
export const FACILITY_MARK_SRC =
  "/facility/5c69784a-ce98-47bf-a5d6-6c5c62c4fe5d.png";

type FacilityWordmarkProps = {
  size?: number;
  className?: string;
};

export function FacilityWordmark({
  size = 22,
  className = "",
}: FacilityWordmarkProps) {
  return (
    <span
      className={`facility-wordmark ${className}`.trim()}
      style={{ fontSize: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FACILITY_MARK_SRC}
        alt=""
        className="facility-wordmark-icon"
        style={{ height: size * 1.9 }}
      />
      <span className="facility-wordmark-text">
        <span>Facility</span>
        <span className="facility-wordmark-nineteen">19</span>
      </span>
    </span>
  );
}
