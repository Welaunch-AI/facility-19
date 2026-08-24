export const CAL_DEMO_URL = "https://cal.com/aviralbhutani/welaunch.ai";

type CalPrefill = {
  name: string;
  email: string;
  domain?: string;
  sixtyDayGoal?: string;
  primaryGoals?: string[];
};

export function buildCalDemoLink({
  name,
  email,
  domain,
  sixtyDayGoal,
  primaryGoals,
}: CalPrefill) {
  const notes = [
    domain ? `Domain: ${domain}` : null,
    sixtyDayGoal ? `60-day goal: ${sixtyDayGoal}` : null,
    primaryGoals?.length ? `Goals: ${primaryGoals.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (email) params.set("email", email);
  if (notes) params.set("notes", notes);

  const qs = params.toString();
  return qs ? `${CAL_DEMO_URL}?${qs}` : CAL_DEMO_URL;
}

type CalEmbedOptions = {
  layout?: "month_view" | "week_view" | "column_view";
  theme?: "light" | "dark" | "auto";
};

export function buildCalEmbedUrl({
  layout = "month_view",
  theme = "light",
}: CalEmbedOptions = {}) {
  const params = new URLSearchParams({
    embed: "true",
    layout,
    theme,
    useSlotsViewOnSmallScreen: "true",
  });
  return `${CAL_DEMO_URL}?${params.toString()}`;
}

export const CAL_EMBED_URL = buildCalEmbedUrl();
