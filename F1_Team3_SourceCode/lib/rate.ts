import { MAX_PACKET_RATE, MIN_PACKET_RATE } from "./config";

export function clampRate(rate: number): number {
  return Math.min(Math.max(rate, MIN_PACKET_RATE), MAX_PACKET_RATE);
}

export function isValidRate(rate: number): boolean {
  return Number.isFinite(rate) && rate >= MIN_PACKET_RATE && rate <= MAX_PACKET_RATE;
}
