import { callBackend } from "./backend-client";
import { markRecovered } from "./backend-stats";
import { HEALTH_PROBE_INTERVAL_MS } from "./config";
import { getBackends } from "./registry";
import type { BackendState } from "./types";

async function probe(origin: string, backend: BackendState): Promise<void> {
  const result = await callBackend(origin, backend);
  if (result.ok) markRecovered(backend);
}

/** Pings every unhealthy backend, at most once per probe interval. */
export function probeUnhealthyBackends(origin: string): void {
  const now = Date.now();

  for (const backend of getBackends()) {
    const probedRecently = now - backend.lastProbeAt < HEALTH_PROBE_INTERVAL_MS;
    if (backend.healthy || probedRecently) continue;

    backend.lastProbeAt = now;
    void probe(origin, backend);
  }
}
