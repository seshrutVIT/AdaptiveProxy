import { NextResponse } from "next/server";
import { getBackends, getLog, getStrategy, resetStatistics } from "@/lib/registry";
import type { StatsResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats: StatsResponse = {
    strategy: getStrategy(),
    backends: getBackends(),
    log: getLog(),
  };
  return NextResponse.json(stats);
}

export async function DELETE() {
  resetStatistics();
  return NextResponse.json({ ok: true });
}
