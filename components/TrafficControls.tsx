"use client";

import { useEffect, useState } from "react";
import { MAX_PACKET_RATE, MIN_PACKET_RATE } from "@/lib/config";
import { clampRate, isValidRate } from "@/lib/rate";
import type { PacketTotals } from "@/lib/types";

interface TrafficControlsProps {
  rate: number;
  isRunning: boolean;
  totals: PacketTotals;
  onRateChange: (rate: number) => void;
  onToggleRunning: () => void;
  onSendOne: () => void;
  onReset: () => void;
}

const SECONDARY_BUTTON =
  "rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100";

/** Number box that lets the user type a rate while staying in sync with the slider. */
function RateInput({ rate, onChange }: { rate: number; onChange: (rate: number) => void }) {
  const [draft, setDraft] = useState(String(rate));

  useEffect(() => {
    setDraft(String(rate));
  }, [rate]);

  function handleTyping(text: string) {
    setDraft(text);
    const typed = Number(text);
    if (text !== "" && isValidRate(typed)) onChange(typed);
  }

  function handleBlur() {
    const typed = Number(draft);
    const corrected = draft === "" || Number.isNaN(typed) ? rate : clampRate(typed);
    onChange(corrected);
    setDraft(String(corrected));
  }

  return (
    <input
      type="number"
      min={MIN_PACKET_RATE}
      max={MAX_PACKET_RATE}
      value={draft}
      onChange={(event) => handleTyping(event.target.value)}
      onBlur={handleBlur}
      aria-label="Packets per second"
      className="w-20 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
    />
  );
}

export default function TrafficControls(props: TrafficControlsProps) {
  const { rate, isRunning, totals, onRateChange, onToggleRunning, onSendOne, onReset } = props;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onToggleRunning}
          className="w-36 rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          {isRunning ? "Stop traffic" : "Start traffic"}
        </button>

        <input
          type="range"
          min={MIN_PACKET_RATE}
          max={MAX_PACKET_RATE}
          value={rate}
          onChange={(event) => onRateChange(Number(event.target.value))}
          aria-label="Packet rate slider"
          className="w-56"
        />
        <RateInput rate={rate} onChange={onRateChange} />
        <span className="text-sm text-slate-600">packets per second</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={onSendOne} className={SECONDARY_BUTTON}>
          Send 1 packet
        </button>
        <button onClick={onReset} className={SECONDARY_BUTTON}>
          Reset statistics
        </button>
        <p className="text-sm text-slate-700">
          Sent {totals.sent}, served {totals.served}, failed {totals.failed}
        </p>
      </div>
    </div>
  );
}
