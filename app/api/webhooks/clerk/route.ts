import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { z } from "zod";

import { getSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

const clerkEmailAddressSchema = z.object({
  email_address: z.string().email(),
});

const clerkUserCreatedDataSchema = z.object({
  id: z.string().min(1),
  first_name: z.union([z.string(), z.null()]).optional(),
  email_addresses: z.array(clerkEmailAddressSchema).min(1),
});

const clerkWebhookEventSchema = z.object({
  type: z.string(),
  data: z.unknown(),
});

function jsonError(message: string, status: 400 | 500): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: Request): Promise<NextResponse> {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return jsonError("Server misconfiguration", 500);
  }

  const headerList = await headers();
  const svixId = headerList.get("svix-id");
  const svixTimestamp = headerList.get("svix-timestamp");
  const svixSignature = headerList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return jsonError("Missing Svix headers", 400);
  }

  const payloadString = await req.text();

  let verifiedPayload: unknown;
  try {
    verifiedPayload = new Webhook(webhookSecret).verify(payloadString, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch {
    return jsonError("Invalid webhook signature", 400);
  }

  const parsedEnvelope = clerkWebhookEventSchema.safeParse(verifiedPayload);
  if (!parsedEnvelope.success) {
    return jsonError("Invalid webhook envelope", 400);
  }

  const { type, data } = parsedEnvelope.data;

  if (type !== "user.created") {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  }

  const parsedUser = clerkUserCreatedDataSchema.safeParse(data);
  if (!parsedUser.success) {
    return jsonError("Invalid user.created payload", 400);
  }

  const user = parsedUser.data;
  const primaryEmail = user.email_addresses[0]?.email_address;
  if (!primaryEmail) {
    return jsonError("Missing primary email", 400);
  }

  let orgId: string;
  try {
    const supabase = getSupabaseServiceRoleClient();
    const { data: rpcResult, error } = await supabase.rpc(
      "bootstrap_clerk_user",
      {
        p_clerk_user_id: user.id,
        p_email: primaryEmail,
        p_first_name: user.first_name ?? null,
      },
    );

    if (error) {
      console.error("bootstrap_clerk_user failed", error);
      return jsonError("Database error", 500);
    }

    if (typeof rpcResult !== "string") {
      console.error("Unexpected RPC shape", rpcResult);
      return jsonError("Database error", 500);
    }

    orgId = rpcResult;
  } catch (e) {
    console.error("Webhook execution error", e);
    return jsonError("Server error", 500);
  }

  return NextResponse.json({ ok: true, org_id: orgId }, { status: 200 });
}
