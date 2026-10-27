import { DROP_FADE_MS, ENTRY_LEG_MS, EXIT_LEG_MS } from "@/lib/packet-timing";
import type { Point } from "./layout";

export interface PacketPath {
  xs: number[];
  ys: number[];
  opacities: number[];
  /** Position of each keyframe as a fraction (0 to 1) of the whole animation. */
  times: number[];
  durationMs: number;
  isDropped: boolean;
}

interface PathPoints {
  client: Point;
  proxy: Point;
  server: Point | null;
}

/**
 * Successful packet: client, proxy, server, proxy, client.
 * The proxy to server and server to proxy legs together take exactly the measured latency.
 * Failed packet: client, proxy, then it fades out.
 */
export function buildPacketPath(latencyMs: number | null, points: PathPoints): PacketPath {
  const { client, proxy, server } = points;

  if (latencyMs === null || server === null) {
    const total = ENTRY_LEG_MS + DROP_FADE_MS;
    return {
      xs: [client.x, proxy.x, proxy.x],
      ys: [client.y, proxy.y, proxy.y],
      opacities: [1, 1, 0],
      times: [0, ENTRY_LEG_MS / total, 1],
      durationMs: total,
      isDropped: true,
    };
  }

  const total = ENTRY_LEG_MS + latencyMs + EXIT_LEG_MS;
  const reachesServerAt = ENTRY_LEG_MS + latencyMs / 2;
  const backAtProxyAt = ENTRY_LEG_MS + latencyMs;

  return {
    xs: [client.x, proxy.x, server.x, proxy.x, client.x],
    ys: [client.y, proxy.y, server.y, proxy.y, client.y],
    opacities: [1, 1, 1, 1, 1],
    times: [0, ENTRY_LEG_MS / total, reachesServerAt / total, backAtProxyAt / total, 1],
    durationMs: total,
    isDropped: false,
  };
}
