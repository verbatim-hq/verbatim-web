"use server";

import { z } from "zod";
import Stripe from "stripe";

import { getSupabaseServerClient } from "@/lib/supabase/server";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function getStripe(): Stripe {
  return new Stripe(requiredEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2025-02-24.acacia",
  });
}

async function requireOrgId() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.rpc("current_org_id");
  if (error) throw new Error("Unable to resolve org");
  if (typeof data !== "string" || data.length === 0) throw new Error("Missing org");
  return { supabase, orgId: data };
}

const checkoutSchema = z.object({
  returnPath: z.string().min(1).max(200).optional(),
});

export async function createCheckoutSessionAction(input: unknown): Promise<string> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

  const { orgId } = await requireOrgId();

  const priceId = requiredEnv("STRIPE_PRICE_ID");
  const appUrl = requiredEnv("NEXT_PUBLIC_APP_URL");

  const returnPath = parsed.data.returnPath ?? "/projects";
  const successUrl = new URL(returnPath, appUrl);
  successUrl.searchParams.set("upgraded", "1");

  const cancelUrl = new URL(returnPath, appUrl);

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    client_reference_id: orgId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
    allow_promotion_codes: true,
  });

  if (!session.url) throw new Error("Stripe session missing URL");
  return session.url;
}

const portalSchema = z.object({
  returnPath: z.string().min(1).max(200).optional(),
});

export async function createPortalSessionAction(input: unknown): Promise<string> {
  const parsed = portalSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid input");

  const { supabase, orgId } = await requireOrgId();

  const { data: org, error } = await supabase
    .from("orgs")
    .select("stripe_customer_id, tier")
    .eq("id", orgId)
    .maybeSingle();

  if (error || !org) throw new Error("Failed to load org");
  if (org.tier !== "pro") throw new Error("Not a pro org");
  if (!org.stripe_customer_id) throw new Error("Missing Stripe customer id");

  const appUrl = requiredEnv("NEXT_PUBLIC_APP_URL");
  const returnUrl = new URL(parsed.data.returnPath ?? "/projects", appUrl).toString();

  const portal = await getStripe().billingPortal.sessions.create({
    customer: org.stripe_customer_id,
    return_url: returnUrl,
  });

  return portal.url;
}

