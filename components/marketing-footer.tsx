import Link from "next/link";
import { CAL_DEMO_URL } from "@/lib/cal-demo-link";
import { Wordmark } from "@/components/marketing-nav";
import "./marketing-footer.css";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const PRODUCT_LINKS: FooterLink[] = [
  { label: "Meet the team", href: "/#agents" },
  { label: "How it works", href: "/#how" },
  { label: "Pricing", href: "/#pricing" },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: "Proof", href: "/#proof" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const GET_STARTED_LINKS: FooterLink[] = [
  { label: "Create your workspace →", href: "/start" },
  { label: "Meet Aria →", href: "/talk-to-aria" },
  { label: "Book a call →", href: CAL_DEMO_URL, external: true },
];

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: FooterLink[];
}) {
  return (
    <div className="marketing-footer-col">
      <div className="eyebrow">{title}</div>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            {item.external ? (
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <div className="wrap marketing-footer-grid">
        <div className="marketing-footer-brand">
          <Wordmark size={26} />
          <p>
            America&apos;s first AI staffing company built for facility
            management. Deployed, monitored, and maintained by a 40-person
            operations team.
          </p>
          <div className="marketing-footer-status">
            <span className="live-dot" />
            <span className="mono">Systems operational · 99.98% uptime</span>
          </div>
        </div>
        <FooterCol title="Product" items={PRODUCT_LINKS} />
        <FooterCol title="Company" items={COMPANY_LINKS} />
        <FooterCol title="Get started" items={GET_STARTED_LINKS} />
      </div>
      <div className="wrap marketing-footer-bottom">
        <span>© 2026 ARB Global LLC · Facility19</span>
        <span className="mono">v3.2 · Built in America</span>
      </div>
    </footer>
  );
}
