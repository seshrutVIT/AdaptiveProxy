import type { StrategyName } from "../types";
import { selectLowestLatency } from "./lowest-latency";
import { selectRoundRobin } from "./round-robin";
import type { SelectionStrategy } from "./types";

export const strategies: Record<StrategyName, SelectionStrategy> = {
  "round-robin": selectRoundRobin,
  "lowest-latency": selectLowestLatency,
};
