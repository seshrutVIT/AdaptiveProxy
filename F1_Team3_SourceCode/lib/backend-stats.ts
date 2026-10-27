import { EWMA_ALPHA, FAILURES_BEFORE_UNHEALTHY } from "./config";
import type { BackendState } from "./types";

/** Exponentially weighted moving average: recent samples count more than old ones. */
export function updateEwma(previous: number | null, sample: number): number {
  if (previous === null) return sample;
  return EWMA_ALPHA * sample + (1 - EWMA_ALPHA) * previous;
}

export function recordSuccess(backend: BackendState, latencyMs: number): void {
  backend.ewmaLatencyMs = updateEwma(backend.ewmaLatencyMs, latencyMs);
  backend.requestCount += 1;
  backend.consecutiveFailures = 0;
}

export function recordFailure(backend: BackendState): void {
  backend.failureCount += 1;
  backend.consecutiveFailures += 1;
  if (backend.consecutiveFailures >= FAILURES_BEFORE_UNHEALTHY) {
    backend.healthy = false;
  }
}

/** A recovered backend starts with no latency history so it is tried again promptly. */
export function markRecovered(backend: BackendState): void {
  backend.healthy = true;
  backend.consecutiveFailures = 0;
  backend.ewmaLatencyMs = null;
}
