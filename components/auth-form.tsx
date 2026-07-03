"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";
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

  async function signInWithGoogle() {
    if (submitting || isTransitioning || !startPageReady || sent) return;

    setSubmitting(true);
    setError(null);
    const supabase = createClient();

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent("/onboarding?step=1")}`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setSubmitting(false);
    }
  }

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

            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              disabled={submitting || sent || isTransitioning || !startPageReady}
              className="sign-in-google-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="sign-in-auth-divider" aria-hidden>
              <span>or</span>
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
