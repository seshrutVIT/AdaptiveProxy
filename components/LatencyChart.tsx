import type { LatencySample } from "@/hooks/useLatencyHistory";
import { buildLinePath } from "@/lib/chart-path";
import { LATENCY_HISTORY_SAMPLES } from "@/lib/config";
import type { BackendState } from "@/lib/types";

const WIDTH = 900;
const HEIGHT = 220;
const MARGIN = { left: 48, right: 12, top: 12, bottom: 12 };
const MIN_AXIS_MAX_MS = 200;
const AXIS_STEP_MS = 100;

interface LatencyChartProps {
  history: LatencySample[];
  backends: BackendState[];
}

function chooseAxisMax(history: LatencySample[]): number {
  const readings = history.flatMap((sample) => Object.values(sample)).filter((value) => value !== null);
  const highest = Math.max(MIN_AXIS_MAX_MS, ...readings);
  return Math.ceil(highest / AXIS_STEP_MS) * AXIS_STEP_MS;
}

export default function LatencyChart({ history, backends }: LatencyChartProps) {
  const axisMax = chooseAxisMax(history);
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

  const toY = (latencyMs: number) => MARGIN.top + plotHeight - (latencyMs / axisMax) * plotHeight;
  // The newest sample sits at the right edge and older samples move left.
  const stepX = plotWidth / (LATENCY_HISTORY_SAMPLES - 1);
  const toX = (index: number) => WIDTH - MARGIN.right - (history.length - 1 - index) * stepX;

  const gridValues = [0, axisMax / 2, axisMax];

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Measured latency of each server over time">
        {gridValues.map((value) => (
          <g key={value}>
            <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={toY(value)} y2={toY(value)} className="stroke-slate-200" />
            <text x={MARGIN.left - 8} y={toY(value) + 4} textAnchor="end" className="fill-slate-600 text-[12px]">
              {value} ms
            </text>
          </g>
        ))}

        {backends.map((backend) => (
          <path
            key={backend.id}
            d={buildLinePath(history.map((sample) => sample[backend.id] ?? null), toX, toY)}
            fill="none"
            stroke={backend.color}
            strokeWidth={2.5}
          />
        ))}
      </svg>

      <ul className="mt-2 flex flex-wrap gap-4 text-sm text-slate-700">
        {backends.map((backend) => (
          <li key={backend.id}>
            <span className="mr-2 inline-block h-3 w-3 align-middle" style={{ backgroundColor: backend.color }} />
            {backend.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
