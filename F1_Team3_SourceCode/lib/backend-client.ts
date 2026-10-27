import { REQUEST_TIMEOUT_MS } from "./config";
import type { BackendState } from "./types";

export type BackendCallResult =
  | { ok: true; latencyMs: number }
  | { ok: false };

/** Sends one request to a backend and measures the round trip time. */
export async function callBackend(origin: string, backend: BackendState): Promise<BackendCallResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const startedAt = performance.now();

  try {
    const response = await fetch(`${origin}/api/backends/${backend.id}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return { ok: false };
    return { ok: true, latencyMs: Math.round(performance.now() - startedAt) };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}
