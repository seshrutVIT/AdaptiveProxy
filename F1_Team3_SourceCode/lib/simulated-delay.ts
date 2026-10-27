import { LATENCY_JITTER_RATIO } from "./config";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Real networks are noisy, so each simulated response varies a little around the base latency. */
export function withJitter(baseMs: number): number {
  const spread = baseMs * LATENCY_JITTER_RATIO;
  return baseMs + (Math.random() * 2 - 1) * spread;
}
