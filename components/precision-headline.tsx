"use client";

import { useEffect, useState } from "react";

type AiWord = {
  before: string;
  morph: string;
  ai: string;
  after: string;
};

const AI_WORDS: AiWord[] = [
  { before: "PREC", morph: "I", ai: "AI", after: "SION" },
  { before: "EFFIC", morph: "I", ai: "AI", after: "ENCY" },
  { before: "COMPL", morph: "I", ai: "AI", after: "ANCE" },
  { before: "INTELL", morph: "I", ai: "AI", after: "GENCE" },
  { before: "REL", morph: "I", ai: "AI", after: "ABILITY" },
];

const TYPE_MS = 68;
const DELETE_MS = 36;
const PAUSE_MS = 420;
const HOLD_MS = 2400;

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function renderWord(word: AiWord, morphed: boolean, visibleChars: number) {
  const middle = morphed ? word.ai : word.morph;
  const beforeLen = word.before.length;
  const middleLen = middle.length;
  const afterLen = word.after.length;

  let beforeShown = "";
  let middleShown = "";
  let afterShown = "";

  if (visibleChars <= beforeLen) {
    beforeShown = word.before.slice(0, visibleChars);
  } else if (visibleChars <= beforeLen + middleLen) {
    beforeShown = word.before;
    middleShown = middle.slice(0, visibleChars - beforeLen);
  } else {
    beforeShown = word.before;
    middleShown = middle;
    afterShown = word.after.slice(0, visibleChars - beforeLen - middleLen);
  }

  return { beforeShown, middleShown, afterShown, highlightAi: morphed };
}

export function PrecisionHeadline() {
  const [wordIndex, setWordIndex] = useState(0);
  const [morphed, setMorphed] = useState(false);
  const [visibleChars, setVisibleChars] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const blink = window.setInterval(() => {
      setShowCursor((value) => !value);
    }, 530);
    return () => window.clearInterval(blink);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function cycle() {
      const word = AI_WORDS[wordIndex];
      const normalLen =
        word.before.length + word.morph.length + word.after.length;
      const morphedLen =
        word.before.length + word.ai.length + word.after.length;

      setMorphed(false);
      setVisibleChars(0);

      for (let i = 1; i <= normalLen; i += 1) {
        if (cancelled) return;
        setVisibleChars(i);
        await delay(TYPE_MS);
      }

      await delay(PAUSE_MS);
      if (cancelled) return;

      setMorphed(true);
      for (let i = normalLen + 1; i <= morphedLen; i += 1) {
        if (cancelled) return;
        setVisibleChars(i);
        await delay(TYPE_MS);
      }

      await delay(HOLD_MS);
      if (cancelled) return;

      for (let i = morphedLen; i >= 0; i -= 1) {
        if (cancelled) return;
        if (i <= normalLen) setMorphed(false);
        setVisibleChars(i);
        await delay(DELETE_MS);
      }

      if (!cancelled) {
        setWordIndex((index) => (index + 1) % AI_WORDS.length);
      }
    }

    void cycle();

    return () => {
      cancelled = true;
    };
  }, [wordIndex]);

  const word = AI_WORDS[wordIndex];
  const { beforeShown, middleShown, afterShown, highlightAi } = renderWord(
    word,
    morphed,
    visibleChars,
  );

  return (
    <h1 className="precision-headline relative z-10 shrink-0 pr-2 font-semibold leading-[0.95] tracking-[-0.04em]">
      <span className="precision-headline-track" aria-live="polite">
        <span className="precision-headline-part">{beforeShown}</span>
        <span
          className={
            highlightAi && middleShown
              ? "precision-headline-ai"
              : "precision-headline-part"
          }
        >
          {middleShown}
        </span>
        <span className="precision-headline-part">{afterShown}</span>
        <span
          className={`precision-headline-cursor ${showCursor ? "is-visible" : ""}`}
          aria-hidden
        >
          |
        </span>
      </span>
    </h1>
  );
}
