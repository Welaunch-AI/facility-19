"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { TRANSITION_MIN_MS, wait } from "@/lib/transition-navigate";

type NavigateOptions = {
  hard?: boolean;
};

export function useTransitionNavigate() {
  const router = useRouter();
  const [transitionLabel, setTransitionLabel] = useState<string | null>(null);

  const navigate = useCallback(
    async (href: string, label: string, options?: NavigateOptions) => {
      setTransitionLabel(label);
      router.prefetch(href);
      await wait(TRANSITION_MIN_MS);

      if (options?.hard) {
        window.location.assign(href);
        return;
      }

      router.push(href);
      router.refresh();
    },
    [router],
  );

  return { transitionLabel, navigate, isTransitioning: transitionLabel !== null };
}
