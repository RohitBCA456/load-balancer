import { Request, Response } from "express";
import httpProxy from "http-proxy";
import { BackendServers } from "../types";

const proxyServer = httpProxy.createProxyServer({});

proxyServer.on("proxyReq", (proxyReq, req: any): void => {
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyData = JSON.stringify(req.body);

    proxyReq.setHeader("Content-Type", "application/json");
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
});

proxyServer.on("end", (req: any, res, proxyRes): void => {
  if (req.targetServer) {
    req.targetServer.activeConnections--;
    console.log(
      `[Conn Down] ${req.targetServer.url} | Active: ${req.targetServer.activeConnections}`,
    );
  }
});

proxyServer.on("error", (err, req: any, res: any): void => {
  if (req.targetServer) {
    req.targetServer.activeConnections--;
  }
  if (!res.headersSent) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Bad Gateway");
  }
});

export const forwardRequest = (
  servers: BackendServers[],
  targetUrl: string,
  req: Request,
  res: Response,
): void => {
  const server = servers.find((s) => s.url === targetUrl);

  if (server) {
    server.activeConnections++;

    (req as any).targetServer = server;
  }

  proxyServer.web(req, res, { target: targetUrl }, (err): void => {
    console.error(`[Proxy Error] to ${targetUrl}:`, err.message);

    if (!res.headersSent) {
      res.status(502).send("Bad Gateway: Backend is unreachable.");
    }
  });
};
