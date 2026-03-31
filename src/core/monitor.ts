import { type BackendServers } from "../types";
import { healthCheck } from "./health-check";

export const monitor = (servers: BackendServers[]): void => {
  console.log("Health Monitor initialized (3s interval)");

  setInterval(async () => {
    await Promise.all(
      servers.map(async (server) => {
        try {
          const isAlive = await healthCheck(server.url);

          if (server.isHealthy !== isAlive) {
            if (isAlive) {
              console.log(`Server ${server.url} is back ONLINE.`);
            } else {
              console.warn(`Server ${server.url} is DOWN.`);
            }
          }

          server.isHealthy = isAlive;
        } catch (error) {
          if (server.isHealthy) {
            console.error(`Health check failed for ${server.url}: ${error}`);
          }
          server.isHealthy = false;
        }
      }),
    );
  }, 3000);
};
