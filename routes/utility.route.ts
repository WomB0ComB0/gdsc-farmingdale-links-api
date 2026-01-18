import { Elysia, t } from 'elysia';
import { API_VERSION } from '../config';
import { timingMiddleware } from '../middleware/timing.middleware';

const stringify = (o: object): string => JSON.stringify(o, null, 2);

const RootResponse = t.Object({
  message: t.String(),
  status: t.Number(),
});

const StatusResponse = t.Object({
  message: t.String(),
  status: t.Number(),
  data: t.Object({
    uptime: t.String(),
    memory: t.Object({
      rss: t.String(),
      heapTotal: t.String(),
      heapUsed: t.String(),
      external: t.String(),
    }),
    version: t.String(),
    environment: t.String(),
  }),
});

const VersionResponse = t.Object({
  version: t.String(),
  status: t.Number(),
});

const InfoResponse = t.Object({
  message: t.String(),
  status: t.Number(),
  data: t.Object({
    name: t.String(),
    contact: t.String(),
    repository: t.String(),
  }),
});

/**
 * Utility routes - root, status, version, info
 */
export const utilityRoute = new Elysia()
  .use(timingMiddleware)
  .get(
    '/',
    () => ({
      message: 'Welcome to the GDSC Farmingdale API. Use /events/upcoming or /events/past',
      status: 200,
    }),
    {
      detail: {
        summary: 'Root endpoint',
        description: 'Welcome message for the API',
        tags: ['Utility'],
      },
      response: RootResponse,
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
  )
  .get(
    '/status',
    () => {
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();
      return {
        message: 'Application status',
        status: 200,
        data: {
          uptime: `${uptime.toFixed(2)} seconds`,
          memory: {
            rss: `${(memoryUsage.rss / 1_024 / 1_024).toFixed(2)} MB`,
            heapTotal: `${(memoryUsage.heapTotal / 1_024 / 1_024).toFixed(2)} MB`,
            heapUsed: `${(memoryUsage.heapUsed / 1_024 / 1_024).toFixed(2)} MB`,
            external: `${(memoryUsage.external / 1_024 / 1_024).toFixed(2)} MB`,
          },
          version: API_VERSION,
          environment: process.env.NODE_ENV || 'development',
        },
      };
    },
    {
      detail: {
        summary: 'Get application status',
        description: 'Returns uptime, memory usage, version, and environment',
        tags: ['Utility'],
      },
      response: StatusResponse,
    },
  )
  .head('/status', ({ set }) => {
    set.status = 200;
  })
  .options('/status', () =>
    stringify({
      message: 'CORS preflight response',
      status: 204,
      allow: 'GET,OPTIONS,HEAD',
    }),
  )
  .get(
    '/version',
    () => ({
      version: API_VERSION,
      status: 200,
    }),
    {
      detail: {
        summary: 'Get API version',
        description: 'Returns the current API version',
        tags: ['Info'],
      },
      response: VersionResponse,
    },
  )
  .head('/version', ({ set }) => {
    set.status = 200;
  })
  .options('/version', () =>
    stringify({
      message: 'CORS preflight response',
      status: 204,
      allow: 'GET,OPTIONS,HEAD',
    }),
  )
  .get(
    '/info',
    () => ({
      message: 'Information about the API',
      status: 200,
      data: {
        name: 'GDSC Farmingdale Links API',
        contact: 'mikeodnis3242004@gmail.com',
        repository: 'https://github.com/WomB0ComB0/gdsc-farmingdale-links-api',
      },
    }),
    {
      detail: {
        summary: 'Get API info',
        description: 'Returns information about the API',
        tags: ['Info'],
      },
      response: InfoResponse,
    },
  )
  .head('/info', ({ set }) => {
    set.status = 200;
  })
  .options('/info', () =>
    stringify({
      message: 'CORS preflight response',
      status: 204,
      allow: 'GET,OPTIONS,HEAD',
    }),
  );
