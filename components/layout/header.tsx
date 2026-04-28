import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { BillingMenu } from "./header.client";

export async function Header() {
  const supabase = await getSupabaseServerClient();
  const { data: orgId } = await supabase.rpc("current_org_id");

  const id = typeof orgId === "string" ? orgId : null;
  let tier: "free" | "pro" = "free";

  if (id) {
    const { data: org } = await supabase
      .from("orgs")
      .select("tier")
      .eq("id", id)
      .maybeSingle();
    if (org?.tier === "pro") tier = "pro";
  }

  return (
    <header className="relative z-[2] mx-auto flex max-w-[1140px] items-center justify-between gap-4 px-8 py-6">
      <Wordmark href="/projects" />
      <div className="flex items-center gap-3">
        <Link
          href="/projects"
          className="meta inline-flex min-h-11 items-center rounded-[10px] border border-[var(--border)] px-4 text-[var(--text-soft)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
        >
          Projects
        </Link>
        <BillingMenu tier={tier} />
      </div>
    </header>
  );
}

