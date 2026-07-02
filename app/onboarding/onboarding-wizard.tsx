"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { PRIMARY_GOAL_OPTIONS } from "@/lib/agent-catalog";
import { TRANSITION_MIN_MS, wait } from "@/lib/transition-navigate";
import type { OnboardingAnswers } from "@/lib/workspaces";
import {
  AppHeader,
  BrandButton,
  GhostButton,
  PrimaryButton,
  ShellCard,
  StepIndicator,
} from "@/components/app-shell";
import { GlowCard } from "@/components/ui/spotlight-card";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { LoadingInline } from "@/components/loading-spinner";
import { TransitionOverlay } from "@/components/transition-overlay";

const TOTAL_STEPS = 5;

export function OnboardingWizard({
  initialAnswers,
  initialStep,
  initialWorkspaceId,
}: {
  initialAnswers: OnboardingAnswers;
  initialStep: number;
  initialWorkspaceId: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = Number(searchParams.get("step") ?? initialStep);
  const [step, setStep] = useState(
    Math.min(TOTAL_STEPS, Math.max(1, stepParam || initialStep || 1)),
  );
  const [workspaceId, setWorkspaceId] = useState(initialWorkspaceId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(initialAnswers.full_name ?? "");
  const [domain, setDomain] = useState(initialAnswers.domain ?? "");
  const [sixtyDayGoal, setSixtyDayGoal] = useState(
    initialAnswers.sixty_day_goal ?? "",
  );
  const [primaryGoals, setPrimaryGoals] = useState<string[]>(
    initialAnswers.primary_goals ?? [],
  );
  const [customGoal, setCustomGoal] = useState(initialAnswers.custom_goal ?? "");
  const [revealed, setRevealed] = useState(false);
  const [dotFlash, setDotFlash] = useState(0);

  const bumpDotFlash = () => setDotFlash((n) => n + 1);

  useEffect(() => {
    const s = Number(searchParams.get("step"));
    if (s >= 1 && s <= TOTAL_STEPS) setStep(s);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    void wait(TRANSITION_MIN_MS).then(() => {
      if (!cancelled) setRevealed(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleGoal(goal: string) {
    setPrimaryGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  }

  async function saveAndAdvance(
    nextStep: number,
    answers: OnboardingAnswers,
  ) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: nextStep, answers, workspaceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      if (data.workspaceId) setWorkspaceId(data.workspaceId);

      if (nextStep === 6) {
        router.push(`/workspaces/${data.workspaceId}`);
        router.refresh();
        return;
      }

      setStep(nextStep);
      router.replace(`/onboarding?step=${nextStep}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleNext(event?: FormEvent) {
    event?.preventDefault();
    if (step === 1) {
      if (!fullName.trim()) return setError("Enter your name.");
      bumpDotFlash();
      await saveAndAdvance(2, { full_name: fullName.trim() });
    } else if (step === 2) {
      if (!domain.trim()) return setError("Enter your company domain.");
      bumpDotFlash();
      await saveAndAdvance(3, { domain: domain.trim() });
    } else if (step === 3) {
      if (sixtyDayGoal.trim().length < 20) {
        return setError("Tell us a bit more about your 60-day goal (20+ chars).");
      }
      bumpDotFlash();
      await saveAndAdvance(4, { sixty_day_goal: sixtyDayGoal.trim() });
    } else if (step === 4) {
      if (primaryGoals.length === 0 && !customGoal.trim()) {
        return setError("Select at least one goal or describe your own.");
      }
      bumpDotFlash();
      await saveAndAdvance(5, {
        primary_goals: primaryGoals,
        custom_goal: customGoal.trim() || undefined,
      });
    } else if (step === 5) {
      bumpDotFlash();
      await saveAndAdvance(6, {
        full_name: fullName,
        domain,
        sixty_day_goal: sixtyDayGoal,
        primary_goals: primaryGoals,
        custom_goal: customGoal.trim() || undefined,
      });
    }
  }

  return (
    <div className="app-shell-root app-shell-root--dotted relative min-h-dvh">
      <DottedSurface flashSignal={dotFlash} />
      {!revealed ? (
        <TransitionOverlay label="Setting up your workspace…" />
      ) : null}
      <div
        className={`relative z-10 flex min-h-dvh flex-col transition-opacity duration-700 ease-out ${
          revealed ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <AppHeader
          title="Let's set up your workspace"
          subtitle={`Step ${step} of ${TOTAL_STEPS}`}
          subtitleAlign="right"
          backHref={step > 1 ? undefined : "/workspaces"}
        />
        <main className="mx-auto w-full max-w-[640px] flex-1 px-6 py-10 md:px-10">
          <StepIndicator current={step} total={TOTAL_STEPS} />

          <ShellCard className="mt-8 p-8">
          {step === 1 ? (
            <>
              <h2 className="text-[24px] font-medium tracking-[-0.02em]">
                What is your name?
              </h2>
              <p className="mt-2 text-[15px] text-[#5E6472]">
                We&apos;ll use this to personalize your workspace.
              </p>
              <label className="app-shell-label mt-8 block">Your name</label>
              <input
                className="app-shell-input mt-3"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
              />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h2 className="text-[24px] font-medium tracking-[-0.02em]">
                What is your company domain?
              </h2>
              <p className="mt-2 text-[15px] text-[#5E6472]">
                We&apos;ll validate your digital footprint and start research in
                the background.
              </p>
              <label className="app-shell-label mt-8 block">Domain</label>
              <input
                className="app-shell-input mt-3"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="acmecorp.com"
              />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <h2 className="text-[24px] font-medium tracking-[-0.02em]">
                What do you need to fix in the next 60 days?
              </h2>
              <p className="mt-2 text-[15px] text-[#5E6472]">
                Be specific — this drives your agent recommendations.
              </p>
              <label className="app-shell-label mt-8 block">60-day goal</label>
              <textarea
                className="app-shell-input mt-3 min-h-[140px] resize-y"
                value={sixtyDayGoal}
                onChange={(e) => setSixtyDayGoal(e.target.value)}
                placeholder="Our dispatch team is drowning in manual routing..."
              />
            </>
          ) : null}

          {step === 4 ? (
            <>
              <h2 className="text-[24px] font-medium tracking-[-0.02em]">
                Which goals matter most?
              </h2>
              <p className="mt-2 text-[15px] text-[#5E6472]">
                Select all that apply, or describe your own.
              </p>
              <div className="mt-6 space-y-3">
                {PRIMARY_GOAL_OPTIONS.map((goal) => (
                  <GlowCard
                    key={goal}
                    as="label"
                    className={`app-shell-select-card flex items-start gap-3 p-4 ${
                      primaryGoals.includes(goal) ? "is-selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={primaryGoals.includes(goal)}
                      onChange={() => toggleGoal(goal)}
                      className="mt-1"
                    />
                    <span className="text-[14px]">{goal}</span>
                  </GlowCard>
                ))}
              </div>
              <label className="app-shell-label mt-6 block">Other goal</label>
              <input
                className="app-shell-input mt-3"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="Anything outside these options"
              />
            </>
          ) : null}

          {step === 5 ? (
            <>
              <h2 className="text-[24px] font-medium tracking-[-0.02em]">
                Review and continue
              </h2>
              <dl className="mt-6 space-y-4 text-[15px]">
                <div>
                  <dt className="app-shell-label">Name</dt>
                  <dd className="mt-1">{fullName}</dd>
                </div>
                <div>
                  <dt className="app-shell-label">Domain</dt>
                  <dd className="mt-1">{domain}</dd>
                </div>
                <div>
                  <dt className="app-shell-label">60-day goal</dt>
                  <dd className="mt-1 text-[#5E6472]">{sixtyDayGoal}</dd>
                </div>
                <div>
                  <dt className="app-shell-label">Primary goals</dt>
                  <dd className="mt-1">
                    {[...primaryGoals, customGoal].filter(Boolean).join(", ")}
                  </dd>
                </div>
              </dl>
            </>
          ) : null}

          {error ? (
            <p className="mt-4 text-[14px] text-[var(--danger)]">{error}</p>
          ) : null}

          <div className="mt-8 flex gap-3">
            {step > 1 ? (
              <GhostButton
                type="button"
                disabled={saving || !revealed}
                onClick={() => {
                  bumpDotFlash();
                  const prev = step - 1;
                  setStep(prev);
                  router.replace(`/onboarding?step=${prev}`);
                }}
              >
                Back
              </GhostButton>
            ) : null}
            {step < 5 ? (
              <PrimaryButton
                type="button"
                disabled={saving || !revealed}
                className="ml-auto"
                onClick={() => handleNext()}
              >
                {saving ? <LoadingInline size="sm" /> : "Continue"}
              </PrimaryButton>
            ) : (
              <BrandButton
                type="button"
                disabled={saving || !revealed}
                className="ml-auto"
                onClick={() => handleNext()}
              >
                {saving ? <LoadingInline size="sm" /> : "Enter workspace"}
              </BrandButton>
            )}
          </div>
        </ShellCard>
        </main>
      </div>
    </div>
  );
}
