/** How long a packet takes to travel from the client to the proxy and back out. */
export const ENTRY_LEG_MS = 250;
export const EXIT_LEG_MS = 250;
/** A failed packet stops at the proxy and fades out. */
export const DROP_FADE_MS = 300;

/** Total time a packet stays on screen. Successful packets spend `latencyMs` between proxy and server. */
export function packetLifetimeMs(latencyMs: number | null): number {
  if (latencyMs === null) return ENTRY_LEG_MS + DROP_FADE_MS;
  return ENTRY_LEG_MS + latencyMs + EXIT_LEG_MS;
}
