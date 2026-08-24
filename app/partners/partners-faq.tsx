"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { PARTNERS_FAQS } from "@/lib/partners-faqs";

export function PartnersFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="grid-bg relative">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="max-w-2xl">
          <span className="eyebrow eyebrow-dot">FAQ</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {PARTNERS_FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="div" key={f.q} delay={i * 60} variant="up">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group block w-full text-left"
                >
                  <div className="flex items-start justify-between gap-6 py-6">
                    <div className="flex-1">
                      <div className="text-lg font-medium text-ink transition-colors group-hover:text-brand">
                        {f.q}
                      </div>
                      <div
                        className="grid transition-all duration-500 ease-out"
                        style={{
                          gridTemplateRows: isOpen ? "1fr" : "0fr",
                          opacity: isOpen ? 1 : 0,
                          marginTop: isOpen ? "0.75rem" : "0",
                        }}
                      >
                        <p className="max-w-3xl overflow-hidden text-ink-muted">
                          {f.a}
                        </p>
                      </div>
                    </div>
                    <span
                      className="mt-1 font-mono text-xl leading-none text-ink-muted transition-transform duration-300"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      {isOpen ? "–" : "+"}
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
