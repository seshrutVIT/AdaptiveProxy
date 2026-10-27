import type { ProxyResponse, StatsResponse, StrategyName } from "./types";

export async function fetchStats(): Promise<StatsResponse> {
  const response = await fetch("/api/stats", { cache: "no-store" });
  return response.json();
}

/** Sends `count` packets through the proxy. A null entry means that packet failed. */
export async function sendPacketBatch(
  count: number,
  spreadMs: number
): Promise<(ProxyResponse | null)[]> {
  const response = await fetch("/api/proxy/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count, spreadMs }),
  });
  if (!response.ok) return Array(count).fill(null);

  const body: { results: (ProxyResponse | null)[] } = await response.json();
  return body.results;
}

export async function updateBackend(
  id: string,
  update: { simulatedLatencyMs?: number; isDown?: boolean }
): Promise<void> {
  await fetch(`/api/admin/backends/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
}

export async function addServer(): Promise<void> {
  await fetch("/api/admin/backends", { method: "POST" });
}

export async function removeServer(id: string): Promise<void> {
  await fetch(`/api/admin/backends/${id}`, { method: "DELETE" });
}

export async function changeStrategy(strategy: StrategyName): Promise<void> {
  await fetch("/api/strategy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ strategy }),
  });
}

export async function resetStats(): Promise<void> {
  await fetch("/api/stats", { method: "DELETE" });
}
