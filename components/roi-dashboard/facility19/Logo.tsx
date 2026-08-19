export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo/welaunch-logo-black.svg"
        alt="WeLaunch"
        className="h-7 w-auto object-contain"
      />
    </div>
  );
}
