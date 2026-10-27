import { callBackend } from "./backend-client";
import { recordFailure, recordSuccess } from "./backend-stats";
import { appendLog, getBackends, getStrategy } from "./registry";
import { strategies } from "./strategies";
import type { ProxyResponse } from "./types";

/**
 * Chooses a backend with the active strategy and forwards the request.
 * If the chosen backend fails, the next candidate is tried (failover).
 * Returns null when every healthy backend has failed.
 */
export async function forwardRequest(origin: string): Promise<ProxyResponse | null> {
  const strategyName = getStrategy();
  const selectBackend = strategies[strategyName];
  const alreadyTried = new Set<string>();

  while (true) {
    const candidates = getBackends().filter(
      (backend) => backend.healthy && !alreadyTried.has(backend.id)
    );
    if (candidates.length === 0) return null;

    const chosen = selectBackend(candidates);
    alreadyTried.add(chosen.id);

    const result = await callBackend(origin, chosen);
    if (!result.ok) {
      recordFailure(chosen);
      continue;
    }

    recordSuccess(chosen, result.latencyMs);
    appendLog({
      backendName: chosen.name,
      latencyMs: result.latencyMs,
      strategy: strategyName,
      failedOver: alreadyTried.size > 1,
    });
    return { servedBy: chosen.name, servedById: chosen.id, latencyMs: result.latencyMs };
  }
}
