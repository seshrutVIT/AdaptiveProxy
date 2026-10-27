import type { StrategyName } from "@/lib/types";

const OPTIONS: { value: StrategyName; label: string }[] = [
  { value: "lowest-latency", label: "Lowest latency (adaptive)" },
  { value: "round-robin", label: "Round robin (baseline)" },
];

interface StrategySelectorProps {
  active: StrategyName;
  onChange: (strategy: StrategyName) => void;
}

export default function StrategySelector({ active, onChange }: StrategySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const isActive = option.value === active;
        const style = isActive
          ? "border-blue-800 bg-blue-800 text-white"
          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100";
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`rounded-md border px-4 py-2 text-sm font-medium ${style}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
