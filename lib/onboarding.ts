import type { SupabaseClient } from "@supabase/supabase-js";
import type { OnboardingAnswers } from "@/lib/workspaces";

export async function ensureProfile(
  supabase: SupabaseClient,
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> },
  authProvider?: string,
) {
  const metaName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? null,
      full_name: metaName,
      auth_provider: authProvider ?? null,
      onboarding_step: metaName ? 2 : 1,
      onboarding_answers: metaName ? { full_name: metaName } : {},
    });
    return;
  }

  await supabase
    .from("profiles")
    .update({
      email: user.email ?? null,
      ...(metaName ? { full_name: metaName } : {}),
      ...(authProvider ? { auth_provider: authProvider } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
}

export async function saveOnboardingStep(
  supabase: SupabaseClient,
  userId: string,
  step: number,
  answers: Partial<OnboardingAnswers>,
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_answers")
    .eq("id", userId)
    .single();

  const merged = {
    ...((profile?.onboarding_answers as OnboardingAnswers) ?? {}),
    ...answers,
  };

  await supabase
    .from("profiles")
    .update({
      onboarding_step: step,
      onboarding_answers: merged,
      ...(answers.full_name ? { full_name: answers.full_name } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  return merged;
}
