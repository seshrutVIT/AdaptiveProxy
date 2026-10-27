import type { SelectionStrategy } from "./types";

let nextIndex = 0;

export const selectRoundRobin: SelectionStrategy = (candidates) => {
  const chosen = candidates[nextIndex % candidates.length];
  nextIndex += 1;
  return chosen;
};
