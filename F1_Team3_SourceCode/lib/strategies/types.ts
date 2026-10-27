import type { BackendState } from "../types";

/** Picks one backend from a non-empty list of healthy candidates. */
export type SelectionStrategy = (candidates: BackendState[]) => BackendState;
