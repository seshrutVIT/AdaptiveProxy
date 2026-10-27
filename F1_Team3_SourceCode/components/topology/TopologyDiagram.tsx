"use client";

import type { BackendState, StrategyName, VisualPacket } from "@/lib/types";
import NetworkNode from "./NetworkNode";
import Packet from "./Packet";
import ServerNode from "./ServerNode";
import { CLIENT_BOX, PROXY_BOX, computeLayout } from "./layout";

const STRATEGY_LABELS: Record<StrategyName, string> = {
  "lowest-latency": "Lowest latency",
  "round-robin": "Round robin",
};

const FALLBACK_PACKET_COLOR = "#475569";

interface TopologyDiagramProps {
  backends: BackendState[];
  packets: VisualPacket[];
  strategy: StrategyName;
}

export default function TopologyDiagram({ backends, packets, strategy }: TopologyDiagramProps) {
  const layout = computeLayout(backends.map((backend) => backend.id));

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className="w-full"
      role="img"
      aria-label="Packets flowing from the internet through the reverse proxy to the servers"
    >
      <line x1={layout.client.x} y1={layout.client.y} x2={layout.proxy.x} y2={layout.proxy.y} className="stroke-slate-300" strokeWidth={2} />

      {backends.map((backend) => {
        const isReachable = backend.healthy && !backend.isDown;
        const server = layout.servers[backend.id];
        return (
          <line
            key={backend.id}
            x1={layout.proxy.x}
            y1={layout.proxy.y}
            x2={server.x}
            y2={server.y}
            stroke={isReachable ? "#cbd5e1" : "#b91c1c"}
            strokeWidth={2}
            strokeDasharray={isReachable ? undefined : "6 4"}
          />
        );
      })}

      <NetworkNode center={layout.client} {...CLIENT_BOX} title="Internet" subtitle="clients" />
      <NetworkNode center={layout.proxy} {...PROXY_BOX} title="Reverse proxy" subtitle={STRATEGY_LABELS[strategy]} isEmphasized />
      {backends.map((backend) => (
        <ServerNode key={backend.id} backend={backend} center={layout.servers[backend.id]} />
      ))}

      {packets.map((packet) => {
        const backend = backends.find((candidate) => candidate.id === packet.serverId);
        return (
          <Packet
            key={packet.id}
            latencyMs={packet.latencyMs}
            color={backend?.color ?? FALLBACK_PACKET_COLOR}
            client={layout.client}
            proxy={layout.proxy}
            server={packet.serverId ? layout.servers[packet.serverId] ?? null : null}
          />
        );
      })}
    </svg>
  );
}
