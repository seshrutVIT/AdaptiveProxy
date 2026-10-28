# Adaptive Reverse Proxy with Latency-Aware Routing

A Next.js demo of a reverse proxy that measures how fast each backend responds and routes new packets to the fastest one. A live diagram shows packets going from the internet, through the proxy, to the servers.

The proxy supports round-robin and latency-aware routing, with backend health checks and automatic failover.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Demo script

1. Click **Start traffic** at 10 packets per second. Packets spread across the servers while the proxy learns their speeds, then most go to Server A.
2. Drag the rate slider, or type an exact value such as 40, to change packets per second.
3. Switch to **Round robin**. Traffic splits evenly and the latency chart shows the slow server pulling the average up.
4. Switch back to **Lowest latency**. Drag Server A's latency slider to the right and watch traffic move to Server B.
5. Click **Add server**. A new node appears in the diagram and starts receiving traffic. Click **Remove** to delete one.
6. Click **Take down** on a server. After 3 failed attempts it is removed from the pool and clients still get answers, because the proxy retries on another server.
7. Click **Bring up**. A health probe finds it again within a few seconds.

## Project layout

```
app/api/
  proxy/route.ts                    the reverse proxy endpoint (one packet)
  proxy/batch/route.ts              many packets at once, used by the traffic simulator
  backends/[id]/route.ts            simulated upstream servers
  admin/backends/route.ts           add a server
  admin/backends/[id]/route.ts      change, take down or remove a server
  stats/route.ts                    read or reset statistics
  strategy/route.ts                 switch routing strategy
lib/
  proxy.ts, batch.ts                select, forward, fail over
  strategies/                       round robin and lowest latency
  backend-client.ts                 one timed request to a backend
  backend-stats.ts                  moving average and failure counting
  health-check.ts                   probes removed backends
  registry.ts                       shared in-memory state, add and remove servers
  config.ts                         tunable constants
components/topology/                SVG diagram and packet animation (framer-motion)
components/                         other dashboard parts
hooks/                              polling, traffic simulation, latency history
```

## Notes

- The browser allows about 6 parallel connections per site, so the simulator sends one batch request every 250 ms instead of one request per packet. The proxy spreads the packets inside each batch evenly over that time.
- The diagram replays each measured result: a packet spends exactly the measured latency between the proxy and its server.
- All tunable constants (EWMA weight, exploration rate, packet rate limits, server limit) are in `lib/config.ts`.

## Limits of this demo

State is kept in server memory, so run a single instance. The backends are routes inside the same app so the project starts with one command. In production the proxy would forward to separate servers by URL.
