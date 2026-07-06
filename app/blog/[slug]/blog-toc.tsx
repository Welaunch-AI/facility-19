"use client";

import { useEffect, useMemo, useState } from "react";

type TocItem = {
  id: string;
  title: string;
  depth: 2 | 3;
};

export function BlogToc({
  items,
  stopAtId,
}: {
  items: TocItem[];
  stopAtId?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const ids = items.map((item) => item.id);
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const stopElement = stopAtId ? document.getElementById(stopAtId) : null;

    if (headings.length === 0) return;

    let rafId = 0;

    const updateActiveHeading = () => {
      const offset = 140;
      let current = headings[0].id;

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= offset) {
          current = heading.id;
        } else {
          break;
        }
      }

      const viewportBottom = window.scrollY + window.innerHeight;
      const docBottom = document.documentElement.scrollHeight - 8;
      if (viewportBottom >= docBottom) {
        current = headings[headings.length - 1].id;
      }

      setActiveId((prev) => (prev === current ? prev : current));

      if (stopElement) {
        const hideOffset = 116;
        const shouldHide = stopElement.getBoundingClientRect().top <= hideOffset;
        setIsVisible((prev) => (prev === !shouldHide ? prev : !shouldHide));
      } else {
        setIsVisible((prev) => (prev ? prev : true));
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        updateActiveHeading();
        rafId = 0;
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, stopAtId]);

  const renderedItems = useMemo(() => items, [items]);
  if (!isVisible) return null;

  return (
    <div className="card-soft p-5">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">
        Table of contents
      </p>
      <nav aria-label="Table of contents" className="mt-4">
        <ul className="space-y-2">
          {renderedItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li
                key={item.id}
                className={item.depth === 3 ? "pl-3" : undefined}
              >
                <a
                  href={`#${item.id}`}
                  data-id={item.id}
                  className={
                    "block text-sm leading-6 transition-colors " +
                    (isActive
                      ? "font-medium text-ink"
                      : "text-ink-muted hover:text-ink")
                  }
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
