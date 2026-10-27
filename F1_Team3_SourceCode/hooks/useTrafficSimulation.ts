"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sendPacketBatch } from "@/lib/api-client";
import { DEFAULT_PACKET_RATE, MAX_VISIBLE_PACKETS, SIM_TICK_MS } from "@/lib/config";
import { packetLifetimeMs } from "@/lib/packet-timing";
import type { PacketTotals, VisualPacket } from "@/lib/types";

const EMPTY_TOTALS: PacketTotals = { sent: 0, served: 0, failed: 0 };

/**
 * Generates packets at a chosen rate. Every SIM_TICK_MS it sends one batch to the proxy,
 * then replays each result in the diagram using the server and latency the proxy reported.
 */
export function useTrafficSimulation() {
  const [packets, setPackets] = useState<VisualPacket[]>([]);
  const [totals, setTotals] = useState<PacketTotals>(EMPTY_TOTALS);
  const [isRunning, setIsRunning] = useState(false);
  const [rate, setRate] = useState(DEFAULT_PACKET_RATE);

  // The interval reads the rate from a ref so changing it does not restart the timer.
  const rateRef = useRef(rate);
  rateRef.current = rate;
  const nextPacketId = useRef(1);
  const unsentFraction = useRef(0);

  const showPacket = useCallback((serverId: string | null, latencyMs: number | null) => {
    const id = nextPacketId.current++;
    setPackets((current) =>
      current.length >= MAX_VISIBLE_PACKETS ? current : [...current, { id, serverId, latencyMs }]
    );
    setTimeout(
      () => setPackets((current) => current.filter((packet) => packet.id !== id)),
      packetLifetimeMs(latencyMs)
    );
  }, []);

  const sendBatch = useCallback(
    async (count: number) => {
      setTotals((current) => ({ ...current, sent: current.sent + count }));
      const results = await sendPacketBatch(count, SIM_TICK_MS);

      const staggerMs = SIM_TICK_MS / count;
      results.forEach((result, index) => {
        setTimeout(
          () => showPacket(result?.servedById ?? null, result?.latencyMs ?? null),
          index * staggerMs
        );
      });

      const served = results.filter((result) => result !== null).length;
      setTotals((current) => ({
        ...current,
        served: current.served + served,
        failed: current.failed + (count - served),
      }));
    },
    [showPacket]
  );

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      unsentFraction.current += (rateRef.current * SIM_TICK_MS) / 1000;
      const wholePackets = Math.floor(unsentFraction.current);
      unsentFraction.current -= wholePackets;
      if (wholePackets > 0) void sendBatch(wholePackets);
    }, SIM_TICK_MS);

    return () => clearInterval(timer);
  }, [isRunning, sendBatch]);

  return {
    packets,
    totals,
    isRunning,
    rate,
    setRate,
    toggleRunning: () => setIsRunning((current) => !current),
    sendOne: () => void sendBatch(1),
    resetTotals: () => setTotals(EMPTY_TOTALS),
  };
}
