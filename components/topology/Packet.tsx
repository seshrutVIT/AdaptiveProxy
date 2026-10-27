"use client";

import { motion } from "framer-motion";
import type { Point } from "./layout";
import { buildPacketPath } from "./packet-path";

const PACKET_RADIUS = 6;
const DROPPED_COLOR = "#b91c1c";

interface PacketProps {
  latencyMs: number | null;
  color: string;
  client: Point;
  proxy: Point;
  server: Point | null;
}

export default function Packet({ latencyMs, color, client, proxy, server }: PacketProps) {
  const path = buildPacketPath(latencyMs, { client, proxy, server });

  return (
    <motion.circle
      r={PACKET_RADIUS}
      fill={path.isDropped ? DROPPED_COLOR : color}
      initial={{ cx: path.xs[0], cy: path.ys[0], opacity: 1 }}
      animate={{ cx: path.xs, cy: path.ys, opacity: path.opacities }}
      transition={{ duration: path.durationMs / 1000, times: path.times, ease: "linear" }}
    />
  );
}
