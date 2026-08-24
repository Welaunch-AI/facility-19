"use client";

import { ArrowRight, MarketingNav } from "@/components/marketing-nav";

const navCta = (
  <a className="btn btn-primary" href="#apply" style={{ height: 40 }}>
    Apply to partner <ArrowRight />
  </a>
);

const mobileCta = (
  <a className="btn btn-primary" href="#apply">
    Apply to partner <ArrowRight />
  </a>
);

export function PartnersNav() {
  return (
    <MarketingNav
      currentPath="/partners"
      cta={navCta}
      mobileCta={mobileCta}
    />
  );
}
