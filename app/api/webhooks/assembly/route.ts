import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { assemblyWebhookSchema } from "@/lib/assembly";
import { inngest } from "@/lib/inngest/client";

export const runtime = "nodejs";

function unauthorized(): NextResponse {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: Request): Promise<NextResponse> {
  const secret = process.env.ASSEMBLYAI_WEBHOOK_AUTH;
  if (!secret) {
    console.error("ASSEMBLYAI_WEBHOOK_AUTH is not set");
    return NextResponse.json({ ok: false, error: "Server misconfiguration" }, { status: 500 });
  }

  const h = await headers();
  const authz = h.get("authorization");
  if (!authz || authz !== `Bearer ${secret}`) return unauthorized();

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = assemblyWebhookSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const { transcript_id, status } = parsed.data;

  console.info("[assembly-webhook] received", { transcript_id, status });

  await inngest.send({
    name: "assembly.completed",
    data: { assembly_ai_id: transcript_id, status },
  });

  console.info("[assembly-webhook] forwarded to inngest", { transcript_id, status });

  return NextResponse.json({ ok: true }, { status: 200 });
}

