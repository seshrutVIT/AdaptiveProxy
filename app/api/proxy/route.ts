import { NextResponse } from "next/server";
import { probeUnhealthyBackends } from "@/lib/health-check";
import { forwardRequest } from "@/lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  probeUnhealthyBackends(origin);
  const response = await forwardRequest(origin);

  if (!response) {
    return NextResponse.json({ error: "No healthy backend available" }, { status: 503 });
  }
  return NextResponse.json(response);
}
