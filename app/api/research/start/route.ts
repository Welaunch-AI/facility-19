import { NextResponse } from "next/server";
import {
  domainContentForPrompt,
  fetchDomainContent,
} from "@/lib/domain-research";
import { chatCompletion, getResearchModel } from "@/lib/openrouter";
import { createClient } from "@/lib/supabase/server";
import { getOwnedWorkspace, updateWorkspaceProfile } from "@/lib/workspace-api";
import type { CompanyProfile } from "@/lib/workspaces";
import { normalizeDomain } from "@/lib/workspaces";

type CompanyProfileResponse = CompanyProfile & { summary?: string };

async function analyzeCompany(domain: string, fetchResult: Awaited<ReturnType<typeof fetchDomainContent>>) {
  const pageContent = domainContentForPrompt(fetchResult, domain);
  const sparse = fetchResult.body_excerpt.length < 200;

  const raw = await chatCompletion(
    [
      {
        role: "system",
        content: `You analyze company websites for B2B field service and facility operations.
Return JSON only with keys: company_type, industry, operations (string array), signals (string array), summary (3-4 sentences).

company_type must be one of: field_service, facility_management, saas, agency, gtm_revops, consulting, other.
signals should list concrete evidence such as: technicians, fleet, CMMS, work orders, trucks, job sites, OR saas, gtm, revops, marketing agency, software platform.

Base analysis on page content. ${sparse ? "Page content is sparse—infer cautiously from domain and title only, and note uncertainty in summary." : "Cite specific signals from the page."}`,
      },
      {
        role: "user",
        content: pageContent,
      },
    ],
    { json: true, model: getResearchModel() },
  );

  const parsed = JSON.parse(raw) as CompanyProfileResponse;
  return {
    company_profile: {
      company_type: parsed.company_type,
      industry: parsed.industry,
      operations: parsed.operations ?? [],
      signals: parsed.signals ?? [],
    } satisfies CompanyProfile,
    summary:
      parsed.summary ??
      `Company at ${domain}. ${fetchResult.page_title ? `Site: ${fetchResult.page_title}.` : ""}`,
  };
}

export async function runResearch(workspaceId: string, domain: string, userId: string) {
  const supabase = await createClient();
  const fetchResult = await fetchDomainContent(domain);

  let summary = `Domain ${domain} could not be verified.`;
  let company_profile: CompanyProfile | undefined;

  if (fetchResult.reachable) {
    try {
      const analysis = await analyzeCompany(domain, fetchResult);
      summary = analysis.summary;
      company_profile = analysis.company_profile;
    } catch {
      summary = `Verified domain ${domain}. ${fetchResult.page_title ? `Site title: ${fetchResult.page_title}.` : ""}`;
      company_profile = {
        industry: fetchResult.industry_hints[0],
        operations: fetchResult.industry_hints,
        signals: fetchResult.industry_hints,
      };
    }
  }

  await updateWorkspaceProfile(
    supabase,
    workspaceId,
    {
      research: {
        status: fetchResult.reachable ? "complete" : "failed",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        summary,
        page_title: fetchResult.page_title,
        company_profile,
        raw: {
          reachable: fetchResult.reachable,
          status: fetchResult.status,
          page_title: fetchResult.page_title,
          meta_description: fetchResult.meta_description,
          og_description: fetchResult.og_description,
          headings: fetchResult.headings,
          body_excerpt: fetchResult.body_excerpt.slice(0, 2000),
          industry_hints: fetchResult.industry_hints,
        },
      },
    },
    { status: "onboarding" },
  );

  await supabase.from("intake_messages").insert({
    workspace_id: workspaceId,
    owner_id: userId,
    role: "system",
    content: summary,
    metadata: { type: "research", domain },
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { workspaceId?: string; domain?: string };
  const workspaceId = body.workspaceId;
  const domain = body.domain ? normalizeDomain(body.domain) : "";

  if (!workspaceId || !domain) {
    return NextResponse.json({ error: "Missing workspaceId or domain" }, { status: 400 });
  }

  const ws = await getOwnedWorkspace(supabase, workspaceId, user.id);
  if (!ws) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  await updateWorkspaceProfile(supabase, workspaceId, {
    research: {
      status: "pending",
      started_at: new Date().toISOString(),
      summary: undefined,
    },
  });

  runResearch(workspaceId, domain, user.id).catch(console.error);

  return NextResponse.json({ ok: true, status: "pending" });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = new URL(request.url).searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });
  }

  const ws = await getOwnedWorkspace(supabase, workspaceId, user.id);
  if (!ws) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    research: ws.business_profile?.research ?? { status: "pending" },
  });
}
