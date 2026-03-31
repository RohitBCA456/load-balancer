# 🚀 High-Availability TypeScript Load Balancer

A professional-grade Layer 7 Load Balancer built with **Node.js** and **TypeScript**. This project implements **IP Hashing** for session persistence and a **Background Monitor** for real-time health checks and automatic failover.

---

## 📂 Project Structure

```text
├── algorithm
│   └── IP-hasing.ts     # SHA-256 Hashing & Linear Probing logic
├── core
│   ├── health-check.ts  # Logic for pinging /health endpoints
│   ├── monitor.ts       # Background setInterval loop for status updates
│   └── proxy-engine.ts  # http-proxy setup with body-restreaming fix
├── test
│   └── test-servers.ts  # Mock backend instances (Ports 3001-3003)
├── types
│   └── index.ts         # Centralized TypeScript interfaces
├── config.ts            # Environment and server pool configurations
└── server.ts            # Entry point & Express Gateway
```

---

## ✨ Key Features

1. **Sticky Sessions (IP Hashing)**
   - Uses the client's IP address to generate a consistent hash
   - Ensures users are always routed to the same backend server
   - Critical for applications relying on local session data

2. **Intelligent Failover**
   - If the primary hashed server is down, the system utilizes Linear Probing
   - Checks the next available server in the pool until a healthy one is found
   - Ensures zero downtime for users

3. **Real-time Health Monitoring**
   - Background "heartbeat" service pings backends every 3 seconds
   - Servers returning non-200 responses are instantly pulled from rotation
   - Automatic recovery when servers come back online

4. **POST Body Support**
   - Custom `proxyReq` interceptor re-streams buffered JSON data
   - Solves the common "Proxy Hang" issue with Express middleware and http-proxy

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
git clone https://github.com/RohitBCA456/load-balancer.git
cd load-balancer
npm install
```

### Running the System

**Start the Backend Servers:**

```bash
npx ts-node src/test/test-servers.ts
```

**Start the Load Balancer (in a separate terminal):**

```bash
npm run dev
```

---

## 🧪 Testing the Load Balancer

- **Standard Request:** Open http://localhost:8000 in your browser to see a response from a specific port
- **Sticky Session Test:** Refresh the page to verify you stay on the same port
- **Failover Test:** Stop one test server and watch automatic routing to healthy peers
- **Data Test:** Send a POST request via curl

```bash
curl -X POST http://localhost:8000/data \
  -H "Content-Type: application/json" \
  -d '{"user":"rohit"}'
```

---
