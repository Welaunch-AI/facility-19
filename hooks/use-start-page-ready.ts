"use client";

import { useEffect, useState } from "react";
import {
  START_PAGE_MAX_MS,
  START_PAGE_MIN_MS,
} from "@/lib/spline-sign-in";

export function useStartPageReady(robotReady: boolean) {
  const [minElapsed, setMinElapsed] = useState(false);
  const [maxElapsed, setMaxElapsed] = useState(false);

  useEffect(() => {
    const minTimer = window.setTimeout(() => setMinElapsed(true), START_PAGE_MIN_MS);
    const maxTimer = window.setTimeout(() => setMaxElapsed(true), START_PAGE_MAX_MS);
    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, []);

  const ready =
    minElapsed && (robotReady || maxElapsed);

  return { ready, minElapsed, maxElapsed };
}
