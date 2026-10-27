import {
  DEFAULT_NEW_SERVER_LATENCY_MS,
  INITIAL_LATENCIES_MS,
  MAX_BACKENDS,
  MAX_LOG_ENTRIES,
  MIN_BACKENDS,
  SERVER_COLORS,
} from "./config";
import type { BackendState, RequestLogEntry, StrategyName } from "./types";

interface ProxyState {
  backends: BackendState[];
  nextServerSequence: number;
  strategy: StrategyName;
  log: RequestLogEntry[];
  nextLogId: number;
}

function serverLabel(sequence: number): string {
  const isLetter = sequence < 26;
  return `Server ${isLetter ? String.fromCharCode(65 + sequence) : sequence + 1}`;
}

function createBackend(sequence: number, latencyMs: number): BackendState {
  return {
    id: `server-${sequence}`,
    name: serverLabel(sequence),
    color: SERVER_COLORS[sequence % SERVER_COLORS.length],
    simulatedLatencyMs: latencyMs,
    isDown: false,
    healthy: true,
    consecutiveFailures: 0,
    ewmaLatencyMs: null,
    activeRequests: 0,
    requestCount: 0,
    failureCount: 0,
    lastProbeAt: 0,
  };
}

function createInitialState(): ProxyState {
  return {
    backends: INITIAL_LATENCIES_MS.map((latency, sequence) => createBackend(sequence, latency)),
    nextServerSequence: INITIAL_LATENCIES_MS.length,
    strategy: "lowest-latency",
    log: [],
    nextLogId: 1,
  };
}

// Stored on globalThis so the state survives hot reloads in development.
const globalStore = globalThis as unknown as { proxyState?: ProxyState };
const state = (globalStore.proxyState ??= createInitialState());

export function getBackends(): BackendState[] {
  return state.backends;
}

export function findBackend(id: string): BackendState | undefined {
  return state.backends.find((backend) => backend.id === id);
}

/** Returns the new server, or null when the pool is already at its maximum size. */
export function addBackend(): BackendState | null {
  if (state.backends.length >= MAX_BACKENDS) return null;

  const backend = createBackend(state.nextServerSequence, DEFAULT_NEW_SERVER_LATENCY_MS);
  state.nextServerSequence += 1;
  state.backends.push(backend);
  return backend;
}

/** Returns false when the server does not exist or it is the last one left. */
export function removeBackend(id: string): boolean {
  if (state.backends.length <= MIN_BACKENDS) return false;

  const remaining = state.backends.filter((backend) => backend.id !== id);
  const wasRemoved = remaining.length < state.backends.length;
  state.backends = remaining;
  return wasRemoved;
}

export function getStrategy(): StrategyName {
  return state.strategy;
}

export function setStrategy(strategy: StrategyName): void {
  state.strategy = strategy;
}

export function getLog(): RequestLogEntry[] {
  return state.log;
}

export function appendLog(entry: Omit<RequestLogEntry, "id" | "timestamp">): void {
  state.log.unshift({ ...entry, id: state.nextLogId++, timestamp: Date.now() });
  state.log.length = Math.min(state.log.length, MAX_LOG_ENTRIES);
}

export function resetStatistics(): void {
  for (const backend of state.backends) {
    backend.ewmaLatencyMs = null;
    backend.requestCount = 0;
    backend.failureCount = 0;
    backend.consecutiveFailures = 0;
    backend.healthy = true;
  }
  state.log = [];
}
