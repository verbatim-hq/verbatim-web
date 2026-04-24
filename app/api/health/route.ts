import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Returns 200 OK + a small JSON payload with the commit SHA and build time.
 * Used by:
 *   - Vercel deployment checks
 *   - Day-1 smoke test ("is the app online?")
 *   - Future uptime monitor
 *
 * Do NOT expose any env var values, build logs, or user counts here — this
 * endpoint is unauthenticated.
 */
export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "verbatim-web",
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev",
    time: new Date().toISOString(),
  });
}

export const dynamic = "force-dynamic";
