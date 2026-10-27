import { forwardRequest } from "./proxy";
import { sleep } from "./simulated-delay";
import type { ProxyResponse } from "./types";

/**
 * Sends several packets through the proxy, spread evenly over spreadMs.
 * Spreading matters: if all packets started at the same instant they would all
 * see the same latency averages and pile onto one server.
 */
export async function forwardBatch(
  origin: string,
  count: number,
  spreadMs: number
): Promise<(ProxyResponse | null)[]> {
  const spacingMs = spreadMs / count;

  const packets = Array.from({ length: count }, async (_, index) => {
    await sleep(index * spacingMs);
    return forwardRequest(origin);
  });
  return Promise.all(packets);
}
