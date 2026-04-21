"use client";

import { useEffect } from "react";

const CLASS_NAME = "aria-voice-page";

export function TalkBodyUnlock() {
  useEffect(() => {
    document.body.classList.add(CLASS_NAME);
    return () => document.body.classList.remove(CLASS_NAME);
  }, []);
  return null;
}
