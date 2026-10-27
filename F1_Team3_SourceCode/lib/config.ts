/** Servers created at startup. Each number is that server's simulated base latency. */
export const INITIAL_LATENCIES_MS = [80, 150, 250];
export const DEFAULT_NEW_SERVER_LATENCY_MS = 120;
export const MIN_BACKENDS = 1;
export const MAX_BACKENDS = 8;

/** One color per server, reused in the diagram, the chart and the table. */
export const SERVER_COLORS = [
  "#0f766e",
  "#b45309",
  "#1d4ed8",
  "#be123c",
  "#4d7c0f",
  "#0e7490",
  "#a16207",
  "#475569",
];

/** Weight given to the newest latency sample in the moving average (0 to 1). */
export const EWMA_ALPHA = 0.3;

/** Fraction of requests sent to a random backend so a recovered server gets noticed. */
export const EXPLORATION_RATE = 0.1;

export const FAILURES_BEFORE_UNHEALTHY = 3;
export const REQUEST_TIMEOUT_MS = 2000;
export const HEALTH_PROBE_INTERVAL_MS = 3000;
export const MAX_LOG_ENTRIES = 30;

export const LATENCY_JITTER_RATIO = 0.1;

/** A busy server is slower: each request already being handled adds this much delay. */
export const LOAD_PENALTY_MS = 5;

/** Traffic simulator */
export const SIM_TICK_MS = 250;
export const MIN_PACKET_RATE = 1;
export const MAX_PACKET_RATE = 100;
export const DEFAULT_PACKET_RATE = 10;
export const MAX_BATCH_SIZE = 100;
export const MAX_VISIBLE_PACKETS = 150;

/** Dashboard */
export const DASHBOARD_POLL_MS = 500;
export const LATENCY_HISTORY_SAMPLES = 60;
