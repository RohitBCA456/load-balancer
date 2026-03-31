import dotenv from "dotenv";
import { BackendServers } from "./types";
import express, { Request, Response } from "express";
import { getServer } from "./algorithm/IP-hasing";
import { forwardRequest } from "./core/proxy-engine";
import { monitor } from "./core/monitor";

dotenv.config({ path: "./.env" });

const servers: BackendServers[] = [
  { url: "http://localhost:3001", isHealthy: true, activeConnections: 0 },
  { url: "http://localhost:3002", isHealthy: true, activeConnections: 0 },
  { url: "http://localhost:3003", isHealthy: true, activeConnections: 0 },
];

const app = express();

app.use(express.json());

monitor(servers);

app.all("*", async (req: Request, res: Response): Promise<unknown> => {
  const clientIdentifier = req.ip || "unknown";

  console.log(`Request coming from IP: ${clientIdentifier}`);

  const serverIndex = await getServer(clientIdentifier, servers);

  const target = servers[serverIndex];

  if (!target) {
    console.error("Critical: No healthy backend found for request.");
    return res.status(503).send("Service Unavailable: No healthy backends.");
  }

  forwardRequest(target.url, req, res);
});

const PORT = process.env.PORT;
app.listen(PORT, (): void => {
  console.log(`load balancer is up on server ${PORT}`);
});
