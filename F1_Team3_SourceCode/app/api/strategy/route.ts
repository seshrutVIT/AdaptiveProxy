import { NextResponse } from "next/server";
import { strategies } from "@/lib/strategies";
import { setStrategy } from "@/lib/registry";
import type { StrategyName } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body: { strategy: StrategyName } = await request.json();

  if (!(body.strategy in strategies)) {
    return NextResponse.json({ error: "Unknown strategy" }, { status: 400 });
  }
  setStrategy(body.strategy);
  return NextResponse.json({ ok: true });
}
