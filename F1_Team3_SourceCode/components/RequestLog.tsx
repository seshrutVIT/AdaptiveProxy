import type { RequestLogEntry } from "@/lib/types";

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

export default function RequestLog({ entries }: { entries: RequestLogEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-600">No requests yet. Use the buttons above to send some.</p>;
  }

  return (
    <div className="max-h-72 overflow-y-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-slate-600">
          <tr>
            <th className="pb-2 pr-4 font-medium">Time</th>
            <th className="pb-2 pr-4 font-medium">Routed to</th>
            <th className="pb-2 pr-4 font-medium">Response time</th>
            <th className="pb-2 pr-4 font-medium">Strategy</th>
            <th className="pb-2 font-medium">Failover</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-t border-slate-200">
              <td className="py-1.5 pr-4">{formatTime(entry.timestamp)}</td>
              <td className="py-1.5 pr-4">{entry.backendName}</td>
              <td className="py-1.5 pr-4">{entry.latencyMs} ms</td>
              <td className="py-1.5 pr-4">{entry.strategy}</td>
              <td className="py-1.5">{entry.failedOver ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
