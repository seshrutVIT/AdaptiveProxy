export type StrategyName = "round-robin" | "lowest-latency";

export interface BackendState {
  id: string;
  name: string;
  color: string;
  simulatedLatencyMs: number;
  isDown: boolean;
  healthy: boolean;
  consecutiveFailures: number;
  ewmaLatencyMs: number | null;
  activeRequests: number;
  requestCount: number;
  failureCount: number;
  lastProbeAt: number;
}

export interface RequestLogEntry {
  id: number;
  timestamp: number;
  backendName: string;
  latencyMs: number;
  strategy: StrategyName;
  failedOver: boolean;
}

export interface StatsResponse {
  strategy: StrategyName;
  backends: BackendState[];
  log: RequestLogEntry[];
}

export interface ProxyResponse {
  servedBy: string;
  servedById: string;
  latencyMs: number;
}

/** A packet shown in the diagram. serverId and latencyMs are null when the request failed. */
export interface VisualPacket {
  id: number;
  serverId: string | null;
  latencyMs: number | null;
}

export interface PacketTotals {
  sent: number;
  served: number;
  failed: number;
}
