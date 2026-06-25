"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LOGO_SRC = "/facility/5c69784a-ce98-47bf-a5d6-6c5c62c4fe5d.png";

const NAV_LINKS = [
  { label: "Team", href: "/#agents" },
  { label: "How it works", href: "/#how" },
  { label: "Proof", href: "/#proof" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
  { label: "Partners", href: "/partners", current: true },
] as const;

function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span className="nav-logo-mark" style={{ fontSize: size }}>
      <img
        src={LOGO_SRC}
        alt=""
        style={{
          height: size * 1.9,
          width: "auto",
          display: "block",
          mixBlendMode: "multiply",
        }}
      />
      <span style={{ display: "inline-flex" }}>
        <span>Facility</span>
        <span className="nineteen">19</span>
      </span>
    </span>
  );
}

function ArrowRight({ size = 14 }: { size?: number }) {
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

export function PartnersNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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
          aria-label="Facility19"
          onClick={close}
        >
          <Wordmark />
        </Link>
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={"current" in link ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-cta">
          <a className="btn btn-primary" href="#apply" style={{ height: 40 }}>
            Apply to partner <ArrowRight />
          </a>
        </div>
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              aria-current={"current" in link ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <div className="nav-mobile-ctas">
            <a className="btn btn-primary" href="#apply" onClick={close}>
              Apply to partner <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
