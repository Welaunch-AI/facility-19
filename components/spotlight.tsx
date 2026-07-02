"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpotlightProps = {
  className?: string;
  fill?: string;
  size?: number;
  trackWindow?: boolean;
};

export function Spotlight({
  className = "",
  fill = "#6b7bff",
  size = 400,
  trackWindow = false,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -size, y: -size });
  const [opacity, setOpacity] = useState(0);
  const rafRef = useRef<number>(0);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = trackWindow
          ? containerRef.current!.getBoundingClientRect()
          : containerRef.current!.parentElement!.getBoundingClientRect();
        setPosition({
          x: clientX - rect.left,
          y: clientY - rect.top,
        });
      });
    },
    [trackWindow],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => updatePosition(e.clientX, e.clientY),
    [updatePosition],
  );

  useEffect(() => {
    if (trackWindow) {
      const onEnter = () => setOpacity(1);
      const onLeave = () => setOpacity(0);

      window.addEventListener("mousemove", handleMouseMove);
      document.documentElement.addEventListener("mouseenter", onEnter);
      document.documentElement.addEventListener("mouseleave", onLeave);
      setOpacity(1);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        document.documentElement.removeEventListener("mouseenter", onEnter);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        cancelAnimationFrame(rafRef.current);
      };
    }

    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const onEnter = () => setOpacity(1);
    const onLeave = () => setOpacity(0);

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, trackWindow]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 z-[2] overflow-hidden ${className}`}
    >
      <div
        className="absolute rounded-full transition-opacity duration-300"
        style={{
          width: size,
          height: size,
          left: position.x - size / 2,
          top: position.y - size / 2,
          opacity,
          background: `radial-gradient(circle, ${fill}30 0%, ${fill}15 30%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}
