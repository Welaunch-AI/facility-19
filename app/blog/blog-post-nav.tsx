"use client";

import {
  DefaultMarketingCtas,
  MarketingNav,
} from "@/components/marketing-nav";

export function BlogPostNav() {
  const navCta = <DefaultMarketingCtas />;

  return (
    <MarketingNav currentPath="/blog" cta={navCta} mobileCta={navCta} />
  );
}
