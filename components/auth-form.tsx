"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PrimaryButton, ShellCard } from "@/components/app-shell";
import { FacilityWordmark } from "@/components/facility-wordmark";
import { LoadingInline } from "@/components/loading-spinner";
import { PrecisionHeadline } from "@/components/precision-headline";
import { SignInRobot } from "@/components/sign-in-robot";
import { TransitionOverlay } from "@/components/transition-overlay";
import { useStartPageReady } from "@/hooks/use-start-page-ready";
import { useTransitionNavigate } from "@/hooks/use-transition-navigate";
import { prefetchStartAssets } from "@/lib/spline-sign-in";

type AuthMode = "signin" | "signup";

export function AuthForm() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error") === "auth";
  const { transitionLabel, navigate, isTransitioning } = useTransitionNavigate();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    authError ? "Sign-in failed. Please try again." : null,
  );
  const [robotReady, setRobotReady] = useState(false);
  const { ready: startPageReady } = useStartPageReady(robotReady);

  useEffect(() => {
    prefetchStartAssets();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || submitting || isTransitioning) return;

    setSubmitting(true);
    setError(null);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        if (!password || password.length < 8) {
          setError("Password must be at least 8 characters.");
          setSubmitting(false);
          return;
        }
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          await fetch("/api/auth/ensure-profile", { method: "POST" });
          await navigate("/onboarding?step=1", "Setting up your workspace...", {
            hard: true,
          });
          return;
        }

        setSent(true);
        setSubmitting(false);
        return;
      }

      if (!password) {
        setError("Enter your password.");
        setSubmitting(false);
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) throw signInError;
      await fetch("/api/auth/ensure-profile", { method: "POST" });
      await navigate("/workspaces", "Opening your workspaces...", { hard: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="app-shell-root sign-in-page relative h-dvh overflow-hidden">
      <SignInRobot onReady={() => setRobotReady(true)} />
      <div className="sign-in-right-image-panel" aria-hidden>
        <div className="sign-in-video-frame">
          <video
            src="/Untitled%20design.mp4"
            className="sign-in-right-image"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="sign-in-video-edge-strip" aria-hidden />
        </div>
      </div>
      {!startPageReady ? <TransitionOverlay /> : null}
      {transitionLabel ? <TransitionOverlay label={transitionLabel} /> : null}
      <div
        className={`sign-in-layout relative z-10 transition-opacity duration-700 ease-out ${
          startPageReady ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="sign-in-left">
          <Link href="/" className="sign-in-logo" aria-label="Facility19">
            <FacilityWordmark className="sign-in-wordmark" />
          </Link>
          <div className="sign-in-headline-spacer" aria-hidden />
        </div>

        <div className="sign-in-headline-layer">
          <PrecisionHeadline />
        </div>

        <div className="sign-in-right">
          <ShellCard className="sign-in-card w-full max-w-[440px] p-7 md:p-8">
            <h2 className="text-[22px] font-medium tracking-[-0.02em] text-[#F5F5F3]">
              {mode === "signup" ? "Create your account" : "Sign in to Facility 19"}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#9CA3AF]">
              {sent
                ? "Check your inbox to confirm your account, then sign in."
                : "Use your work email and password."}
            </p>

            <div className="mb-6 mt-6 flex gap-2">
              {(["signin", "signup"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setError(null);
                    setSent(false);
                  }}
                  className={`app-shell-chip flex flex-1 items-center justify-center ${
                    mode === m
                      ? "is-active bg-white text-[#0A0A0B]"
                      : "bg-[#1A1A1D] text-[#9CA3AF] ring-1 ring-inset ring-[#2E2E33]"
                  }`}
                >
                  {m === "signin" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit}>
              <label htmlFor="email" className="app-shell-label">
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={sent}
                className="app-shell-input mt-2"
              />

              <label htmlFor="password" className="app-shell-label mt-4 block">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                required={!sent}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={sent}
                className="app-shell-input mt-2"
              />

              {error ? (
                <p className="mt-3 text-[14px] text-[var(--danger)]">{error}</p>
              ) : null}

              <PrimaryButton
                type="submit"
                disabled={submitting || sent || isTransitioning || !startPageReady}
                className="sign-in-card-submit mt-6 w-full"
              >
                {sent ? (
                  "Check your email"
                ) : submitting || isTransitioning ? (
                  <LoadingInline size="sm" />
                ) : mode === "signup" ? (
                  "Create account"
                ) : (
                  "Sign in"
                )}
              </PrimaryButton>
            </form>
          </ShellCard>
        </div>
      </div>
    </div>
  );
}
