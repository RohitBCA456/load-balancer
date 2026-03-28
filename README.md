# TS-Sticky-Gateway 🚀

A high-performance, deterministic Layer 7 Load Balancer built with **TypeScript** and **Express**.

## 📖 Overview
This project is an API Gateway that sits in front of multiple backend services. It uses **IP Hashing** to ensure that a specific client is always routed to the same backend server (Session Persistence), while providing a **Linear Probing** failover mechanism if the primary server goes offline.

## ✨ Features
- **Deterministic IP Hashing:** Uses MD5 hashing on Client IPs to map requests to specific server indices.
- **Smart Failover:** Automatically "probes" the next available index in the server array if the hashed target is unhealthy.
- **Reverse Proxy:** Efficiently pipes Request/Response streams using `http-proxy`.
- **Active Health Monitoring:** (In Progress) A background heartbeat system to dynamically update server availability.
- **Type Safety:** Fully written in TypeScript for robust development and error catching.

## ⚙️ How it Works
1. **Ingress:** A request hits the gateway. The middleware extracts the Client IP (handling `x-forwarded-for` headers).
2. **The Hash:** The IP string is converted into a numeric hash.
3. **The Modulo:** We apply `Hash % ServerCount` to find the target index.
4. **Health Check:** - If `Servers[index].isHealthy` is **true**, the request is proxied.
   - If **false**, the balancer increments the index (+1) and checks the next server until a healthy one is found.
5. **Egress:** The `http-proxy` engine handles the data stream between the client and the chosen backend.

## 🛠️ Project Roadmap
- [x] Initial Express + TypeScript boilerplate.
- [x] Implementation of the Hashing/Modulo selection algorithm.
- [x] Integration of `http-proxy` for request forwarding.
- [ ] **Next Step:** Implement automated background health checks via Axios.
- [ ] **Next Step:** Add a Dashboard/Logger to visualize traffic distribution.

## 🚀 Setup & Installation
1. **Clone the repo:**
   ```bash
   git clone [https://github.com/your-username/ts-sticky-gateway.git](https://github.com/your-username/ts-sticky-gateway.git)
   cd ts-sticky-gateway