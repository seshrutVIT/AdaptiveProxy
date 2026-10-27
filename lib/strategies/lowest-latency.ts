import { EXPLORATION_RATE } from "../config";
import type { BackendState } from "../types";
import type { SelectionStrategy } from "./types";

function pickRandom(candidates: BackendState[]): BackendState {
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function pickLeastBusy(candidates: BackendState[]): BackendState {
  return candidates.reduce((best, current) => (current.activeRequests < best.activeRequests ? current : best));
}

/**
 * Estimated delay for a new packet: the measured latency, scaled up by the requests
 * the server is already handling. Without the scaling, every packet arriving before
 * the next measurement would pile onto the same fastest server.
 */
function estimatedDelayMs(backend: BackendState): number {
  return (backend.ewmaLatencyMs ?? 0) * (backend.activeRequests + 1);
}

function pickLowestEstimatedDelay(candidates: BackendState[]): BackendState {
  return candidates.reduce((best, current) =>
    estimatedDelayMs(current) < estimatedDelayMs(best) ? current : best
  );
}

export const selectLowestLatency: SelectionStrategy = (candidates) => {
  const neverMeasured = candidates.filter((backend) => backend.ewmaLatencyMs === null);
  if (neverMeasured.length > 0) return pickLeastBusy(neverMeasured);

  const shouldExplore = Math.random() < EXPLORATION_RATE;
  return shouldExplore ? pickRandom(candidates) : pickLowestEstimatedDelay(candidates);
};
