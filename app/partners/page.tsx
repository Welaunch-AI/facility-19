"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { PartnersNav } from "./partners-nav";

function Hero() {
  return (
    <section className="grid-bg relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-brand/20 blur-3xl"
        style={{ animation: "float 9s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute -left-32 top-60 h-[360px] w-[360px] rounded-full bg-brand/10 blur-3xl"
        style={{ animation: "float 12s ease-in-out infinite reverse" }}
      />
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 md:pt-16 md:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <span
            className="eyebrow eyebrow-dot"
            style={{ animation: "fade-in 0.6s ease-out both" }}
          >
            Facility19 Partner Program
          </span>
          <h1
            className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-ink md:text-7xl"
            style={{
              animation: "blur-in 0.9s ease-out both",
              animationDelay: "120ms",
            }}
          >
            If you know facility management or home services,{" "}
            <span className="text-brand">your network is worth something.</span>
          </h1>
          <p
            className="mx-auto mt-7 max-w-2xl text-lg text-ink-muted md:text-xl"
            style={{
              animation: "fade-up 0.8s ease-out both",
              animationDelay: "320ms",
            }}
          >
            We pay people who open the right doors. No selling. No pitching.
            Just introductions.
          </p>
          <div
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{
              animation: "fade-up 0.8s ease-out both",
              animationDelay: "450ms",
            }}
          >
            <a href="#apply" className="btn-primary group">
              Apply to partner
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#how" className="btn-ghost">
              See how it works
            </a>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { k: "25%", v: "of first invoice, month one" },
              { k: "10%", v: "residual, months 2–12" },
              { k: "$6,750", v: "year-one on a $5K/mo client" },
            ].map((s, i) => (
              <Reveal
                key={s.k}
                delay={600 + i * 120}
                variant="up"
                className="card-soft hover-lift px-5 py-6 text-left"
              >
                <div className="text-3xl font-semibold tracking-tight text-ink">
                  {s.k}
                </div>
                <div className="mt-1 text-sm text-ink-muted">{s.v}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatWeDo() {
  return (
    <section id="program" className="section-fade-top relative bg-surface-2">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="eyebrow eyebrow-dot">What we do</span>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              An AI operating system for FM and home services.
            </h2>
            <p className="mt-5 text-lg text-ink-muted">
              We deploy AI agents that run dispatch, scheduling, compliance,
              vendor management, and customer communications around the clock.
            </p>
            <p className="mt-3 text-lg text-ink-muted">
              Already live at{" "}
              <span className="font-medium text-ink">RAEL Fire Safety</span> and{" "}
              <span className="font-medium text-ink">ProForce Pest Control</span>
              . Not a concept. Running in the field today.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="card-soft p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="eyebrow">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Live deployments
                </div>
                <div className="font-mono text-xs text-ink-muted">
                  facility19 · today
                </div>
              </div>
              <ul className="divide-y divide-line">
                {[
                  {
                    tag: "LD",
                    title:
                      "Rerouted Tech #14 · emergency HVAC · Site 2104",
                    t: "just now",
                  },
                  {
                    tag: "EM",
                    title: "Intake call answered · ticket #48213 created",
                    t: "1m ago",
                  },
                  {
                    tag: "MT",
                    title: "PO #10348 issued · 14% under budget",
                    t: "3m ago",
                  },
                  {
                    tag: "MO",
                    title: "Indexed Carrier 50TCQA12 · manual attached",
                    t: "6m ago",
                  },
                ].map((r, i) => (
                  <li
                    key={r.title}
                    className="group -mx-2 flex items-center gap-4 rounded-md px-2 py-4 transition-colors hover:bg-brand-soft/40"
                    style={{
                      animation: "ticker 0.5s ease-out both",
                      animationDelay: `${i * 120}ms`,
                    }}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-soft font-mono text-xs font-semibold text-brand transition-transform group-hover:scale-110">
                      {r.tag}
                    </span>
                    <span className="flex-1 text-sm text-ink">{r.title}</span>
                    <span className="font-mono text-xs text-ink-muted">
                      {r.t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PROFILES = [
  "FM and home service consultants and advisors",
  "Ex-operators - former directors, VPs, or COOs from FM or trades",
  "CMMS implementation specialists (UtilizeCore, ServiceTitan, Jobber, Corrigo)",
  "Business coaches serving HVAC, pest control, plumbing, or cleaning operators",
  "Trade association members with an active network (IFMA, BOMA, NPMA)",
];

function WhoWeWant() {
  return (
    <section className="grid-bg relative">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <span className="eyebrow eyebrow-dot">Who we&apos;re looking for</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            We&apos;re not recruiting salespeople.{" "}
            <span className="text-brand">We&apos;re recruiting connectors.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-muted">
            If you already live in this world, you&apos;re who we want. If you
            know people who run FM or home service companies, you qualify.
          </p>
        </div>

        <ul className="mt-12 grid gap-3 md:grid-cols-2">
          {PROFILES.map((p, i) => (
            <Reveal
              as="li"
              key={p}
              delay={i * 90}
              variant="up"
              className="card-soft hover-lift flex items-start gap-4 p-5"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition-transform duration-300 hover:rotate-12 hover:scale-110">
                <Check className="h-4 w-4" />
              </span>
              <span className="text-base text-ink">{p}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Earnings() {
  return (
    <section className="earnings-dark relative">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <span className="eyebrow eyebrow-dot">What you earn</span>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
              Simple structure. Recurring income. Zero ongoing work.
            </h2>
            <p className="mt-6 max-w-lg text-lg">
              You introduce. We close. You earn - month one, then every month
              for a year.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="earnings-card p-6 md:p-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest">
                    Month 1
                  </div>
                  <div className="mt-2 text-5xl font-semibold tracking-tight">
                    25%
                  </div>
                  <div className="mt-1 text-sm">
                    of first invoice
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest">
                    Months 2–12
                  </div>
                  <div className="mt-2 text-5xl font-semibold tracking-tight">
                    10%
                  </div>
                  <div className="mt-1 text-sm">
                    residual, every month
                  </div>
                </div>
              </div>

              <div className="earnings-example mt-8 rounded-xl p-5">
                <div className="font-mono text-xs uppercase tracking-widest">
                  Example
                </div>
                <p className="mt-2">
                  One introduction to a{" "}
                  <span className="font-semibold">$5,000/mo</span> client puts{" "}
                  <span className="font-semibold text-brand">$6,750</span> in
                  your pocket over year one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Apply",
    body: "Tell us about your background and network. Approval in under 24 hours.",
  },
  {
    n: "02",
    title: "Introduce",
    body: "An email, a LinkedIn message, or a quick heads-up. We handle everything from there.",
  },
  {
    n: "03",
    title: "Earn",
    body: "When they become a client, your commission starts - and pays for the next 12 months.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="grid-bg relative">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="eyebrow eyebrow-dot">How it works</span>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              Three steps.{" "}
              <span className="text-brand">That&apos;s the whole thing.</span>
            </h2>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 140}
              variant="up"
              className="card-soft hover-lift group relative overflow-hidden p-7"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="font-mono text-sm text-brand">{s.n}</div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-ink transition-transform duration-300 group-hover:-translate-y-0.5">
                {s.title}
              </h3>
              <p className="mt-3 text-ink-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section id="proof" className="section-fade-top relative bg-surface-2">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="eyebrow eyebrow-dot">Proof it works</span>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              Live deployments. Real results.
            </h2>
            <p className="mt-5 text-ink-muted">
              The product is in the field. The results are documented. The door
              is open for the right introduction.
            </p>
          </div>

          <div className="md:col-span-7 grid gap-4">
            <Reveal variant="up" className="card-soft hover-lift p-7">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-ink">
                  RAEL Fire Safety
                </div>
                <div className="eyebrow">
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-emerald-500"
                    style={{
                      animation: "pulse-glow 2.4s ease-in-out infinite",
                    }}
                  />{" "}
                  Live
                </div>
              </div>
              <p className="mt-3 text-ink-muted">
                40 field technicians now have full real-time job site
                visibility. GPS cross-checks against work order status on every
                job. Checkout compliance documented and client-facing.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
                {[
                  { k: "40", v: "techs live" },
                  { k: "100%", v: "GPS verified" },
                  { k: "24/7", v: "coverage" },
                ].map((s, i) => (
                  <Reveal key={s.v} delay={200 + i * 120} variant="scale">
                    <div className="text-2xl font-semibold text-ink">{s.k}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                      {s.v}
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal delay={160} variant="up" className="card-soft hover-lift p-7">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-ink">
                  ProForce Pest Control
                </div>
                <div className="eyebrow">
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-emerald-500"
                    style={{
                      animation: "pulse-glow 2.4s ease-in-out infinite",
                    }}
                  />{" "}
                  Live
                </div>
              </div>
              <p className="mt-3 text-ink-muted">
                Same playbook, pest control vertical - dispatch, intake, and
                compliance, all running with AI agents wired into the existing
                stack.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Do I need to sell anything?",
    a: "No. Your job is the introduction. Once you make the connection, Facility19 runs the entire sales process. You're copied on the first response and then handed off cleanly.",
  },
  {
    q: "What qualifies me to be a partner?",
    a: "If you have genuine relationships with people who run FM or home service companies, you qualify. No certifications, no training, no investment required.",
  },
  {
    q: "When do I get paid?",
    a: "Month 1 commission is paid within 7 days of the first invoice being received. Months 2–12 are paid monthly with a simple statement every month.",
  },
  {
    q: "Is there a limit to how many people I can refer?",
    a: "No cap. Every introduction that converts earns you the same structure.",
  },
  {
    q: "What do I say to the people I introduce?",
    a: "We give you a one-pager you can forward as-is. It doesn't read like marketing. If you want us to draft the intro message for you, we do that too.",
  },
  {
    q: "How long does it take to see a commission?",
    a: "Most partners make their first referral within 21 days of joining. Close rates on warm introductions run above 35%.",
  },
  {
    q: "What industries are Facility19 clients in?",
    a: "Fire protection, pest control, HVAC, cleaning, plumbing, facility management, and any field service business running technicians on work orders.",
  },
  {
    q: "Is this exclusive?",
    a: "No. Refer as many or as few companies as you want, on your timeline, with no minimum commitment.",
  },
];

function FAQ() {
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
          {FAQS.map((f, i) => {
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

const CAL_URL =
  "https://app.cal.com/aviral-bhutani-facility19/facility19-partner-program";
const CAL_EMBED_URL = `${CAL_URL}?embed=true&layout=month_view`;

function CalEmbed() {
  return (
    <section id="apply" className="section-fade-top relative bg-surface-2">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center">
          <span className="eyebrow eyebrow-dot">Apply</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Book a partner call.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-ink-muted">
            Pick a time that works for you. We&apos;ll walk you through the
            program and answer any questions.
          </p>
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-xl border border-line bg-surface p-4">
            <Sparkles className="h-5 w-5 text-brand" />
            <p className="text-sm text-ink-muted">
              Most partners make their first referral within 21 days.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <div className="card-soft overflow-hidden p-1 md:p-1">
            <iframe
              title="Book a facility19 partner call"
              src={CAL_EMBED_URL}
              className="w-full rounded-xl bg-surface"
              style={{ width: "100%", height: "750px", border: 0 }}
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-center text-sm text-ink-muted">
            Calendar not loading?{" "}
            <a
              href={CAL_URL}
              className="font-medium text-brand hover:text-ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open booking page
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-ink">
              facility<span className="text-brand">19</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            Built for the people who run the field.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-ink-muted">
          <a href="#program" className="hover:text-ink">
            Program
          </a>
          <a href="#how" className="hover:text-ink">
            How it works
          </a>
          <a href="#proof" className="hover:text-ink">
            Proof
          </a>
          <a href="#faq" className="hover:text-ink">
            FAQ
          </a>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <a
            href="https://facility19.ai"
            className="hover:text-ink"
            target="_blank"
            rel="noopener noreferrer"
          >
            facility19.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function PartnersPage() {
  return (
    <div className="partners-page-root min-h-screen">
      <PartnersNav />
      <main>
        <Hero />
        <WhatWeDo />
        <WhoWeWant />
        <Earnings />
        <HowItWorks />
        <Proof />
        <FAQ />
        <CalEmbed />
      </main>
      <Footer />
    </div>
  );
}
