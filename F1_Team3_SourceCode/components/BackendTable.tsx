import { MIN_BACKENDS } from "@/lib/config";
import type { BackendState } from "@/lib/types";
import BackendRow from "./BackendRow";

const COLUMNS = [
  "Server",
  "Status",
  "Simulated latency",
  "Measured latency (average)",
  "In flight",
  "Requests served",
  "Failures",
  "Control",
];

interface BackendTableProps {
  backends: BackendState[];
  onChanged: () => void;
}

export default function BackendTable({ backends, onChanged }: BackendTableProps) {
  const totalRequests = backends.reduce((sum, backend) => sum + backend.requestCount, 0);
  const canRemove = backends.length > MIN_BACKENDS;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-slate-600">
            {COLUMNS.map((column) => (
              <th key={column} className="pb-2 pr-4 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {backends.map((backend) => (
            <BackendRow
              key={backend.id}
              backend={backend}
              totalRequests={totalRequests}
              canRemove={canRemove}
              onChanged={onChanged}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
