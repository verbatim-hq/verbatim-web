import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export type UsageGateResult = Readonly<{ allowed: true } | { allowed: false }>;

export async function checkUsageLimit(orgId: string): Promise<UsageGateResult> {
  const supabase = await getSupabaseServerClient();

  const { data: org, error: orgError } = await supabase
    .from("orgs")
    .select("tier")
    .eq("id", orgId)
    .maybeSingle();

  if (orgError || !org) throw new Error("Failed to check tier");

  if (org.tier === "pro") return { allowed: true };

  const { count, error: countError } = await supabase
    .from("sources")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId);

  if (countError) throw new Error("Failed to check usage");

  return { allowed: (count ?? 0) < 2 };
}

