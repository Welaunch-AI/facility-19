"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { CAL_DEMO_URL } from "@/lib/cal-demo-link";
import { MARKETING_NAV_LINKS } from "@/lib/site-nav";
import { WeLaunchLogo } from "@/components/welaunch-logo";

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span className="nav-logo-mark">
      <WeLaunchLogo height={size} />
    </span>
  );
}

export function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      className="arrow"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DefaultMarketingCtas({ height = 40 }: { height?: number }) {
  return (
    <>
      <Link className="btn btn-primary" href="/start" style={{ height }}>
        workspace <ArrowRight />
      </Link>
      <a
        className="btn btn-ghost"
        href={CAL_DEMO_URL}
        target="_blank"
        rel="noreferrer"
        style={{ height }}
      >
        Book a call
      </a>
    </>
  );
}

type MarketingNavProps = {
  currentPath?: string;
  cta: ReactNode;
  mobileCta?: ReactNode;
};

export function MarketingNav({ currentPath, cta, mobileCta }: MarketingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const value = open ? "hidden" : "auto";
    document.documentElement.style.setProperty("overflow", value, "important");
    document.body.style.setProperty("overflow", value, "important");
    return () => {
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav
      className={
        "nav" + (scrolled ? " scrolled" : "") + (open ? " is-open" : "")
      }
    >
      <div className="wrap nav-inner">
        <Link
          className="nav-logo"
          href="/"
          aria-label="WeLaunch"
          onClick={close}
        >
          <Wordmark />
        </Link>
        <div className="nav-links">
          {MARKETING_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === currentPath ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-cta">{cta}</div>
        <button
          type="button"
          className="nav-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={"nav-burger-icon" + (open ? " open" : "")}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
      <div
        className={"nav-mobile" + (open ? " show" : "")}
        aria-hidden={!open}
      >
        <div className="nav-mobile-inner">
          {MARKETING_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              aria-current={link.href === currentPath ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <div className="nav-mobile-ctas">{mobileCta ?? cta}</div>
        </div>
      </div>
    </nav>
  );
}
