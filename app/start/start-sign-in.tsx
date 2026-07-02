"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function StartSignIn() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error") === "auth";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    authError ? "Sign-in link expired or is invalid. Request a new magic link." : null,
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/workspaces`;

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#FAFAF8] text-[#0A0A0B]">
      <div className="mx-auto flex min-h-dvh max-w-[1200px] flex-col justify-center px-6 py-16 md:px-10 lg:flex-row lg:items-center lg:gap-20 lg:px-12 lg:py-24">
        <div className="max-w-[520px] lg:flex-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#5E6472] transition-opacity hover:opacity-70"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[#6B7BFF]" />
            Facility 19
          </Link>

          <h1 className="mt-10 text-[clamp(36px,4.5vw,52px)] font-medium leading-[1.08] tracking-[-0.03em]">
            AI Intake. Real Workspaces. Live Agent Dashboards.
          </h1>

          <p className="mt-6 max-w-[460px] text-[17px] leading-[1.6] text-[#5E6472]">
            Sign in to start the multi-turn business interview. Facility 19 will
            ask follow-ups, build your workspace, and orchestrate your
            back-office agents.
          </p>
        </div>

        <div className="mt-14 w-full max-w-[420px] lg:mt-0 lg:flex-shrink-0">
          <div className="rounded-2xl border border-[#E5E4DE] bg-white p-8 shadow-[0_1px_2px_rgba(10,10,11,0.04)] md:p-10">
            <h2 className="text-[22px] font-medium tracking-[-0.02em]">
              Sign in to Facility 19
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#5E6472]">
              {sent
                ? "Check your inbox for a magic link to continue to your workspace."
                : "We'll email you a magic link to continue to your workspace."}
            </p>

            <form className="mt-8" onSubmit={onSubmit}>
              <label
                htmlFor="work-email"
                className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#5E6472]"
              >
                Work email
              </label>
              <input
                id="work-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                disabled={sent}
                className="mt-3 w-full rounded-xl border border-[#E5E4DE] bg-[#FAFAF8] px-4 py-3.5 text-[15px] text-[#0A0A0B] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#0A0A0B] disabled:opacity-60"
              />

              {error ? (
                <p className="mt-3 text-[14px] leading-relaxed text-[#B42318]">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting || sent}
                className="mt-6 w-full rounded-xl bg-[#0A0A0B] px-4 py-3.5 font-mono text-[12px] uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sent
                  ? "Magic link sent"
                  : submitting
                    ? "Sending..."
                    : "Send magic link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
