"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchStats } from "@/lib/api-client";
import { DASHBOARD_POLL_MS } from "@/lib/config";
import type { StatsResponse } from "@/lib/types";

export function useStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  const refresh = useCallback(async () => {
    setStats(await fetchStats());
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, DASHBOARD_POLL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  return { stats, refresh };
}
