import axios from 'axios';
import type { AxiosResponse } from 'axios';

export const keepAlive = async (): Promise<void> => {
  try {
    const health_url: string = 'https://gdsc-api.onrender.com/api/health';

    // Add a timeout to prevent hanging
    const response: AxiosResponse = await axios.get(health_url, {
      timeout: 5000 // 5 second timeout
    });

    console.log(`Health check status: ${response.status}`);

    if (response.status !== 200) {
      try {
        const data = JSON.parse(response.data);
        console.log(`Health check at: ${new Date().toISOString()}`);
        console.log(`Health check message: ${data.message}`);
      } catch (error) {
        console.error(`Error parsing health check response: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    console.log(JSON.stringify({
      status: response.status,
      timestamp: new Date().toISOString(),
      message: 'Server is running',
    }, null, 2));
  } catch (error) {
    console.error(`Error during health check: ${error instanceof Error ? error.message : String(error)}`);
  }
};
