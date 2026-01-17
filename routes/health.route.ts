import { Elysia, t } from 'elysia';
import { keepAlive } from '../services/keep-alive.service';

const stringify = (o: object): string => JSON.stringify(o, null, 2);

const HealthSchema = t.Object({
  message: t.String(),
  status: t.Number(),
});

/**
 * Health check route
 */
export const healthRoute = new Elysia({ prefix: '/health' })
  .get(
    '/',
    () => {
      console.log('Health check requested');
      // Schedule keep-alive ping
      setInterval(keepAlive, 1000 * 60 * 15);
      return { message: 'ok', status: 200 };
    },
    {
      detail: {
        summary: 'Health check',
        description: 'Returns ok if the API is healthy',
        tags: ['Health'],
      },
      response: HealthSchema,
    },
  )
  .head('/', ({ set }) => {
    set.status = 200;
  })
  .options('/', () =>
    stringify({
      message: 'CORS preflight response',
      status: 204,
      allow: 'GET,OPTIONS,HEAD',
    }),
  );
