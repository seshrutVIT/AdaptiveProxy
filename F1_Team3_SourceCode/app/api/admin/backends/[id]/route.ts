import { NextResponse } from "next/server";
import { findBackend, removeBackend } from "@/lib/registry";

export const dynamic = "force-dynamic";

interface BackendUpdate {
  simulatedLatencyMs?: number;
  isDown?: boolean;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const backend = findBackend(params.id);
  if (!backend) {
    return NextResponse.json({ error: "Unknown backend" }, { status: 404 });
  }

  const update: BackendUpdate = await request.json();
  if (typeof update.simulatedLatencyMs === "number") {
    backend.simulatedLatencyMs = update.simulatedLatencyMs;
  }
  if (typeof update.isDown === "boolean") {
    backend.isDown = update.isDown;
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!removeBackend(params.id)) {
    return NextResponse.json({ error: "Cannot remove this server" }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
