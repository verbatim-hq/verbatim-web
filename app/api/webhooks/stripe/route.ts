import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

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

export async function POST(request: Request): Promise<NextResponse> {
  const webhookSecret = requiredEnv("STRIPE_WEBHOOK_SECRET");
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false, error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabaseServiceRoleClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orgId = session.client_reference_id;

    const customer =
      typeof session.customer === "string" ? session.customer : session.customer?.id;
    const subscription =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!orgId || !customer || !subscription) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const { error } = await supabase
      .from("orgs")
      .update({
        tier: "pro",
        stripe_customer_id: customer,
        stripe_subscription_id: subscription,
      })
      .eq("id", orgId);

    if (error) {
      console.error("Stripe webhook org update failed", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription.id;

    const { data: org, error: findError } = await supabase
      .from("orgs")
      .select("id")
      .eq("stripe_subscription_id", subscriptionId)
      .maybeSingle();

    if (findError) {
      console.error("Stripe webhook lookup failed", findError);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    if (org?.id) {
      const { error: downError } = await supabase
        .from("orgs")
        .update({ tier: "free", stripe_subscription_id: null })
        .eq("id", org.id);

      if (downError) {
        console.error("Stripe webhook downgrade failed", downError);
        return NextResponse.json({ ok: false }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

