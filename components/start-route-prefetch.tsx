"use client";

import { useEffect } from "react";
import { prefetchStartAssets } from "@/lib/spline-sign-in";

export function StartRoutePrefetch() {
  useEffect(() => {
    prefetchStartAssets();
  }, []);
  return null;
}
