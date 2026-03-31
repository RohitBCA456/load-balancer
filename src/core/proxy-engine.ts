import { Request, Response } from "express";
import httpProxy from "http-proxy";

const proxyServer = httpProxy.createProxyServer({});

proxyServer.on("proxyReq", (proxyReq, req: any) => {
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyData = JSON.stringify(req.body);

    proxyReq.setHeader("Content-Type", "application/json");
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
});


export const forwardRequest = (targetUrl: string, req: Request, res: Response) => {
  proxyServer.web(req, res, { target: targetUrl }, (err) => {
    console.error(`[Proxy Error] to ${targetUrl}:`, err.message);
    
    if (!res.headersSent) {
      res.status(502).send("Bad Gateway: Backend is unreachable.");
    }
  });
};