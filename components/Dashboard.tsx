"use client";

import { useLatencyHistory } from "@/hooks/useLatencyHistory";
import { useStats } from "@/hooks/useStats";
import { useTrafficSimulation } from "@/hooks/useTrafficSimulation";
import { changeStrategy, resetStats } from "@/lib/api-client";
import { MAX_BACKENDS } from "@/lib/config";
import type { StrategyName } from "@/lib/types";
import AddServerButton from "./AddServerButton";
import BackendTable from "./BackendTable";
import Card from "./Card";
import HowItWorks from "./HowItWorks";
import LatencyChart from "./LatencyChart";
import RequestLog from "./RequestLog";
import StrategySelector from "./StrategySelector";
import TrafficControls from "./TrafficControls";
import TopologyDiagram from "./topology/TopologyDiagram";

export default function Dashboard() {
  const { stats, refresh } = useStats();
  const traffic = useTrafficSimulation();
  const latencyHistory = useLatencyHistory(stats);

  async function selectStrategy(strategy: StrategyName) {
    await changeStrategy(strategy);
    refresh();
  }

  async function resetEverything() {
    await resetStats();
    traffic.resetTotals();
    refresh();
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-bold">Adaptive Reverse Proxy with Latency-Aware Routing</h1>
        <p className="mt-1 max-w-prose text-slate-600">
          Clients send packets to one proxy. The proxy measures how fast each server answers and sends
          the next packet to the fastest one.
        </p>
      </header>

      {stats && (
        <>
          <Card
            title="Live traffic"
            description="Each dot is one packet, colored by the server that handled it. A red dot is a failed request. The animation replays measured responses, so it trails real traffic by under a second."
          >
            <TrafficControls
              rate={traffic.rate}
              isRunning={traffic.isRunning}
              totals={traffic.totals}
              onRateChange={traffic.setRate}
              onToggleRunning={traffic.toggleRunning}
              onSendOne={traffic.sendOne}
              onReset={resetEverything}
            />
            <div className="mt-4 border border-slate-200 p-2">
              <TopologyDiagram backends={stats.backends} packets={traffic.packets} strategy={stats.strategy} />
            </div>
          </Card>

          <Card
            title="Routing strategy"
            description="Switch strategies, keep the same traffic running, and compare the latency chart."
          >
            <StrategySelector active={stats.strategy} onChange={selectStrategy} />
          </Card>

          <Card title="Measured latency over time" description="Moving average per server. Newest reading is on the right.">
            <LatencyChart history={latencyHistory} backends={stats.backends} />
          </Card>

          <Card
            title="Servers"
            description="Add or remove servers, change how slow they are, or take one down to test failover."
            action={<AddServerButton isDisabled={stats.backends.length >= MAX_BACKENDS} onAdded={refresh} />}
          >
            <BackendTable backends={stats.backends} onChanged={refresh} />
          </Card>

          <Card title="Recent requests" description="Newest first. The last 30 requests are kept.">
            <RequestLog entries={stats.log} />
          </Card>
        </>
      )}

      <Card title="How it works">
        <HowItWorks />
      </Card>
    </main>
  );
}
