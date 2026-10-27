import { NextResponse } from "next/server";
import { addBackend } from "@/lib/registry";

export const dynamic = "force-dynamic";

export async function POST() {
  const backend = addBackend();
  if (!backend) {
    return NextResponse.json({ error: "Server limit reached" }, { status: 409 });
  }
  return NextResponse.json(backend, { status: 201 });
}
