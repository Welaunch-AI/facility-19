const CAL_DEMO_URL =
  "https://cal.com/aviral-bhutani-facility19/discovery-call";

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

export const CAL_EMBED_URL = `${CAL_DEMO_URL}?embed=true&layout=month_view`;
