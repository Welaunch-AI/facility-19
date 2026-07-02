"use client";

import {
  useCallback,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const glowColorMap = {
  brand: "107, 123, 255",
  blue: "59, 130, 246",
  purple: "168, 85, 247",
  green: "34, 197, 94",
  red: "239, 68, 68",
  orange: "249, 115, 22",
} as const;

type GlowColor = keyof typeof glowColorMap;

type GlowCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
  glowColor?: GlowColor;
  as?: ElementType;
  type?: "button" | "submit" | "reset";
};

export function GlowCard({
  children,
  className = "",
  glowColor = "brand",
  as: Component = "div",
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const setSpotlight = useCallback((x: number, y: number) => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
    el.dataset.spotlightActive = "true";
  }, []);

  const clearSpotlight = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.removeProperty("--spot-x");
    el.style.removeProperty("--spot-y");
    delete el.dataset.spotlightActive;
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setSpotlight(event.clientX - rect.left, event.clientY - rect.top);
      onPointerMove?.(event);
    },
    [onPointerMove, setSpotlight],
  );

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      clearSpotlight();
      onPointerLeave?.(event);
    },
    [clearSpotlight, onPointerLeave],
  );

  const glowStyle = {
    "--spot-rgb": glowColorMap[glowColor],
    ...style,
  } as CSSProperties;

  return (
    <Component
      ref={cardRef}
      data-spotlight-card
      data-glow-color={glowColor}
      style={glowStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`spotlight-card ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
