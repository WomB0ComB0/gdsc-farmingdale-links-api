import { FetchHttpClient } from '@effect/platform';
import { Effect, pipe } from 'effect';
import { type FetcherError, type ValidationError, get } from '../utils/fetcher';

const HEALTH_URL = 'https://gdsc-api.onrender.com/api/v1/health';

/**
 * Performs a keep-alive health check to the production API using Effect.
 */
export const keepAlive = async (): Promise<void> => {
  const program = pipe(
    get<{ message: string }>(HEALTH_URL, {
      timeout: 5000,
      retries: 1,
      retryDelay: 1000,
      onError: (error) => {
        console.error(
          `Error during health check: ${error instanceof Error ? error.message : String(error)}`,
        );
      },
    }),
    Effect.tap((data) =>
      Effect.sync(() => {
        console.log(
          JSON.stringify(
            {
              status: 200,
              timestamp: new Date().toISOString(),
              message: data.message || 'Server is running',
            },
            null,
            2,
          ),
        );
      }),
    ),
    Effect.catchAll((error: FetcherError | ValidationError) =>
      Effect.sync(() => {
        console.error(`Health check failed: ${error.toString()}`);
      }),
    ),
  );

  await Effect.runPromise(
    Effect.scoped(Effect.provide(program, FetchHttpClient.layer)),
  );
};

