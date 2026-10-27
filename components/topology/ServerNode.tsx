import { motion } from "framer-motion";
import type { BackendState } from "@/lib/types";
import { SERVER_BOX, type Point } from "./layout";

const STRIPE_WIDTH = 8;

function describeStatus(backend: BackendState): string {
  if (backend.isDown) return "Down";
  if (!backend.healthy) return "Removed from pool";
  const average = backend.ewmaLatencyMs === null ? "no data" : `${Math.round(backend.ewmaLatencyMs)} ms avg`;
  return `${average}, ${backend.activeRequests} in flight`;
}

function borderColor(backend: BackendState): string {
  if (backend.isDown) return "#b91c1c";
  if (!backend.healthy) return "#b45309";
  return "#94a3b8";
}

export default function ServerNode({ backend, center }: { backend: BackendState; center: Point }) {
  const { width, height } = SERVER_BOX;
  // A CSS transform lets the node slide to its new row when servers are added or removed.
  const position = `translate(${center.x - width / 2}px, ${center.y - height / 2}px)`;

  return (
    <g style={{ transform: position, transition: "transform 300ms ease" }}>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <rect width={width} height={height} rx={4} fill="white" stroke={borderColor(backend)} strokeWidth={1.5} />
        <rect width={STRIPE_WIDTH} height={height} fill={backend.color} />
        <text x={STRIPE_WIDTH + 12} y={23} className="fill-slate-900 text-[14px] font-semibold">
          {backend.name}
        </text>
        <text x={STRIPE_WIDTH + 12} y={42} className="fill-slate-600 text-[12px]">
          {describeStatus(backend)}
        </text>
      </motion.g>
    </g>
  );
}
