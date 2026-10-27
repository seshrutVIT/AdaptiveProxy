import { NextResponse } from "next/server";
import { forwardBatch } from "@/lib/batch";
import { MAX_BATCH_SIZE } from "@/lib/config";
import { probeUnhealthyBackends } from "@/lib/health-check";

export const dynamic = "force-dynamic";

/**
 * Used by the traffic simulator. One browser request carries many packets, because
 * browsers allow only about 6 parallel connections per site.
 */
export async function POST(request: Request) {
  const body: { count: number; spreadMs: number } = await request.json();
  const count = Math.min(Math.max(Math.floor(Number(body.count)) || 1, 1), MAX_BATCH_SIZE);
  const spreadMs = Math.max(Number(body.spreadMs) || 0, 0);

  const origin = new URL(request.url).origin;
  probeUnhealthyBackends(origin);

  const results = await forwardBatch(origin, count, spreadMs);
  return NextResponse.json({ results });
}
