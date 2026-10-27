const STEPS = [
  "Packets from clients arrive at the reverse proxy.",
  "The proxy keeps a list of healthy servers and asks the active strategy to pick one.",
  "It forwards the packet and measures the round trip time.",
  "The measurement updates that server's exponentially weighted moving average (EWMA).",
  "The next packet goes to the server with the lowest EWMA, scaled up by how many packets it is already handling. 10% of packets go to a random server so a server that got faster is noticed.",
  "If a server errors or times out, the proxy retries on another one. After 3 failures in a row the server is removed from the pool and probed every 3 seconds until it answers.",
  "Simulated servers slow down as they get busier (5 ms per request in flight), so a favourite server gets slower and traffic shifts to the others.",
];

export default function HowItWorks() {
  return (
    <ol className="max-w-prose list-decimal space-y-1 pl-5 text-sm text-slate-700">
      {STEPS.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  );
}
