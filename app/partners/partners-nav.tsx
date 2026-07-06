"use client";

import Link from "next/link";
import { ArrowRight, MarketingNav } from "@/components/marketing-nav";

export function PartnersNav() {
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

  return (
    <MarketingNav
      currentPath="/partners"
      cta={navCta}
      mobileCta={mobileCta}
    />
  );
}
