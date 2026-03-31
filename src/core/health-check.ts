import axios from "axios";

export const healthCheck = async (url: string): Promise<boolean> => {
  try {
    const heealthCheckUrl = `${url}/health`;

    const response = await axios.get(heealthCheckUrl, { timeout: 2000 });

    if (response.status === 200 && response.data.health === "up") {
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Health check failed for ${url}: ${error}`);
    throw error;
  }
};
