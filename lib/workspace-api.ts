import type { SupabaseClient } from "@supabase/supabase-js";
import type { BusinessProfile, WorkspaceRow } from "@/lib/workspaces";
import { defaultBusinessProfile } from "@/lib/workspaces";

export async function getOwnedWorkspace(
  supabase: SupabaseClient,
  workspaceId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("id, name, lane, status, created_at, business_profile, owner_id")
    .eq("id", workspaceId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as WorkspaceRow & { owner_id: string };
}

export function mergeBusinessProfile(
  current: BusinessProfile | undefined,
  patch: Partial<BusinessProfile>,
): BusinessProfile {
  return { ...defaultBusinessProfile(current), ...current, ...patch };
}

export async function updateWorkspaceProfile(
  supabase: SupabaseClient,
  workspaceId: string,
  patch: Partial<BusinessProfile>,
  extra?: { status?: string; name?: string },
) {
  const { data: ws } = await supabase
    .from("workspaces")
    .select("business_profile")
    .eq("id", workspaceId)
    .single();

  const profile = mergeBusinessProfile(
    ws?.business_profile as BusinessProfile | undefined,
    patch,
  );

  await supabase
    .from("workspaces")
    .update({
      business_profile: profile,
      updated_at: new Date().toISOString(),
      ...extra,
    })
    .eq("id", workspaceId);

  return profile;
}
