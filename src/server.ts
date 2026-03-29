import dotenv from "dotenv";
import { BackendServers } from "./types";
import express, { Request, Response } from "express";
import httpProxy from "http-proxy";
import { getServer } from "./algorithm/IP-hasing";

dotenv.config({ path: "./.env" });

const servers: BackendServers[] = [
  { url: "http://localhost:3001", isHealthy: true, activeConnections: 0 },
  { url: "http://localhost:3002", isHealthy: true, activeConnections: 0 },
  { url: "http://localhost:3003", isHealthy: true, activeConnections: 0 },
];

const app = express();

const proxyServer = httpProxy.createProxyServer({});

app.all("*", async (req: Request, res: Response) => {
  const clientIdentifier = req.ip || "unknown";

  console.log(`Request coming from IP: ${clientIdentifier}`);

  const serverIndex = await getServer(clientIdentifier, servers);

  const target = servers[serverIndex];

  
  if (!target) {
    console.error("Critical: No healthy backend found for request.");
    return res.status(503).send("Service Unavailable: No healthy backends.");
  }
  
  console.log(`Forwarding request from ${clientIdentifier} to ${target.url}`);

  proxyServer.web(req, res, { target: target.url }, (error) => {
    console.log(`proxy error:  ${error}`);
    res.status(502).send("Bad Gateway");
  });
});

const PORT = process.env.PORT;
app.listen(PORT, (): void => {
  console.log(`load balancer is up on server ${PORT}`);
});
