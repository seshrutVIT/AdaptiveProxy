"use client";

import { useState } from "react";
import { removeServer, updateBackend } from "@/lib/api-client";
import type { BackendState } from "@/lib/types";

const MAX_SLIDER_LATENCY_MS = 600;
const SMALL_BUTTON = "rounded-md border border-slate-300 bg-white px-3 py-1 text-sm hover:bg-slate-100 disabled:opacity-50";

interface BackendRowProps {
  backend: BackendState;
  totalRequests: number;
  canRemove: boolean;
  onChanged: () => void;
}

function StatusLabel({ backend }: { backend: BackendState }) {
  if (backend.isDown) return <span className="font-medium text-red-700">Down</span>;
  if (!backend.healthy) return <span className="font-medium text-amber-700">Removed from pool</span>;
  return <span className="font-medium text-green-700">Healthy</span>;
}

export default function BackendRow({ backend, totalRequests, canRemove, onChanged }: BackendRowProps) {
  const [sliderLatencyMs, setSliderLatencyMs] = useState(backend.simulatedLatencyMs);

  const share = totalRequests === 0 ? 0 : Math.round((backend.requestCount / totalRequests) * 100);
  const measuredBarWidth = Math.min(100, ((backend.ewmaLatencyMs ?? 0) / MAX_SLIDER_LATENCY_MS) * 100);

  function handleLatencyChange(latencyMs: number) {
    setSliderLatencyMs(latencyMs);
    updateBackend(backend.id, { simulatedLatencyMs: latencyMs });
  }

  async function handleRemove() {
    await removeServer(backend.id);
    onChanged();
  }

  return (
    <tr className="border-t border-slate-200 align-middle">
      <td className="py-3 pr-4 font-medium">
        <span className="mr-2 inline-block h-3 w-3 align-middle" style={{ backgroundColor: backend.color }} />
        {backend.name}
      </td>
      <td className="py-3 pr-4 text-sm">
        <StatusLabel backend={backend} />
      </td>
      <td className="py-3 pr-4">
        <input
          type="range"
          min={20}
          max={MAX_SLIDER_LATENCY_MS}
          step={10}
          value={sliderLatencyMs}
          onChange={(event) => handleLatencyChange(Number(event.target.value))}
          aria-label={`Simulated latency for ${backend.name}`}
          className="w-28"
        />
        <span className="ml-2 text-sm text-slate-600">{sliderLatencyMs} ms</span>
      </td>
      <td className="py-3 pr-4">
        <div className="h-2 w-28 bg-slate-200">
          <div className="h-2 bg-blue-900" style={{ width: `${measuredBarWidth}%` }} />
        </div>
        <span className="text-xs text-slate-600">
          {backend.ewmaLatencyMs === null ? "no data" : `${Math.round(backend.ewmaLatencyMs)} ms`}
        </span>
      </td>
      <td className="py-3 pr-4 text-sm">{backend.activeRequests}</td>
      <td className="py-3 pr-4 text-sm">
        {backend.requestCount} ({share}%)
      </td>
      <td className="py-3 pr-4 text-sm">{backend.failureCount}</td>
      <td className="py-3">
        <div className="flex gap-2">
          <button onClick={() => updateBackend(backend.id, { isDown: !backend.isDown })} className={SMALL_BUTTON}>
            {backend.isDown ? "Bring up" : "Take down"}
          </button>
          <button onClick={handleRemove} disabled={!canRemove} className={SMALL_BUTTON}>
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
}
