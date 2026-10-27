"use client";

import { useEffect, useState } from "react";
import { LATENCY_HISTORY_SAMPLES } from "@/lib/config";
import type { StatsResponse } from "@/lib/types";

/** Measured latency per server id at one moment. */
export type LatencySample = Record<string, number | null>;

/** Remembers the most recent latency readings so they can be drawn as a chart. */
export function useLatencyHistory(stats: StatsResponse | null): LatencySample[] {
  const [history, setHistory] = useState<LatencySample[]>([]);

  useEffect(() => {
    if (!stats) return;
    const sample: LatencySample = {};
    for (const backend of stats.backends) {
      sample[backend.id] = backend.ewmaLatencyMs;
    }
    setHistory((current) => [...current, sample].slice(-LATENCY_HISTORY_SAMPLES));
  }, [stats]);

  return history;
}
