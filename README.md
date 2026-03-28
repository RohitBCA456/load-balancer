# TS-Sticky-Gateway 🚀

A high-performance Layer 7 Load Balancer built with TypeScript.

## Features
- **IP Hashing (Sticky Sessions):** Maps clients to specific backend servers using their IP address.
- **Smart Failover:** If a "sticky" server goes down, the balancer automatically routes to the next available healthy node.
- **Active Health Checks:** Periodically pings backends to ensure traffic is only sent to live instances.
- **Reverse Proxy:** Transparently forwards requests using `http-proxy`.

## How it Works
1. **Request Ingress:** A client hits the gateway at port 8000.
2. **Hashing:** We take the `x-forwarded-for` or `remoteAddress` and hash it.
3. **Health Validation:** We check the `isHealthy` status of the resulting server.
4. **Proxy:** If healthy, the request is piped; if not, we move to the next index in the server array.

## Setup
1. `npm install`
2. Update `src/config.ts` with your backend server URLs.
3. `npm run dev` to start the balancer.