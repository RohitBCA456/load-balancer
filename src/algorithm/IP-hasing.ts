import { BackendServers } from "../types";
import crypto from "crypto";

export const getServer = async (
  clientIdentifier: string,
  servers: BackendServers[],
): Promise<number> => {
  const hash = crypto
    .createHash("sha256")
    .update(clientIdentifier)
    .digest("hex");

  console.log(`Hash for client ${clientIdentifier}: ${hash}`);

  const healthySevers = servers.filter((server) => server.isHealthy);

  if (healthySevers.length === 0) {
    console.log("No healthy server available");

    return -1;
  }

  const hashInt = parseInt(hash, 16);

  const serverIndex = hashInt % healthySevers.length;

  console.log(
    `selected server index for client ${clientIdentifier}: ${serverIndex}`,
  );

  return serverIndex;
};
