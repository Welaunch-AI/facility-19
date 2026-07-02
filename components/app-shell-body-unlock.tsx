"use client";

import { useLayoutEffect } from "react";

const CLASS_NAME = "app-shell-page";

export function AppShellBodyUnlock() {
  useLayoutEffect(() => {
    document.documentElement.classList.add(CLASS_NAME);
    document.body.classList.add(CLASS_NAME);
    return () => {
      document.documentElement.classList.remove(CLASS_NAME);
      document.body.classList.remove(CLASS_NAME);
    };
  }, []);
  return null;
}
