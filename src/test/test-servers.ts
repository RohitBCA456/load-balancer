import express from "express";

const createBackend = (port: number): void => {
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => {
    console.log(`[Port ${port}] Health check ping received`);
    res.status(200).json({ health: "up" });
  });

  app.post("/data", (req, res) => {
    console.log(`[Port ${port}] Received POST data:`, req.body);
    res.json({
      message: `Hello from backend on port ${port}`,
      receivedData: req.body,
    });
  });

  app.get("*", (req, res) => {
    console.log(`[Port ${port}] Handled GET request`);
    res.send(`Response from Backend Server on Port ${port}\n`);
  });

  app.listen(port, () => {
    console.log(`Backend worker live on http://localhost:${port}`);
  });
};

[3001, 3002, 3003].forEach((port) => createBackend(port));