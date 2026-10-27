import { NextResponse } from "next/server";
import { LOAD_PENALTY_MS } from "@/lib/config";
import { findBackend } from "@/lib/registry";
import { sleep, withJitter } from "@/lib/simulated-delay";

export const dynamic = "force-dynamic";

/**
 * Stand-in for a real upstream server. Its base speed and availability are set from the
 * dashboard, and it slows down while it is handling many requests at once.
 */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const backend = findBackend(params.id);

  if (!backend) {
    return NextResponse.json({ error: "Unknown backend" }, { status: 404 });
  }
  if (backend.isDown) {
    return NextResponse.json({ error: `${backend.name} is down` }, { status: 503 });
  }

  backend.activeRequests += 1;
  try {
    const loadedLatencyMs = backend.simulatedLatencyMs + backend.activeRequests * LOAD_PENALTY_MS;
    await sleep(withJitter(loadedLatencyMs));
    return NextResponse.json({ servedBy: backend.name });
  } finally {
    backend.activeRequests -= 1;
  }
}
