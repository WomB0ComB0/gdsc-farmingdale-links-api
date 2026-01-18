import { cors } from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { swagger } from '@elysiajs/swagger';
import type { SocketAddress } from 'bun';
import { Elysia } from 'elysia';
import { ip } from 'elysia-ip';
import { rateLimit } from 'elysia-rate-limit';
import { elysiaHelmet } from 'elysiajs-helmet';
import logixlysia from 'logixlysia';

import { CORS_ORIGINS, RATE_LIMIT } from './config';
import { errorMiddleware } from './middleware/error.middleware';
import { routes } from './routes';

const stringify = (o: object): string => JSON.stringify(o, null, 2);

/**
 * IP-based rate limit generator
 */
const ipGenerator = (_r: unknown, _s: unknown, ctx: { ip: SocketAddress }) =>
  ctx.ip?.address ?? 'unknown';

/**
 * Helmet security permissions
 */
const permission = {
  SELF: "'self'",
  UNSAFE_INLINE: "'unsafe-inline'",
  HTTPS: 'https:',
  DATA: 'data:',
  NONE: "'none'",
} as const;

/**
 * Main Elysia application with all middleware and routes
 */
export const app = new Elysia({ prefix: '/api/v1' })
  .use(
    logixlysia({
      config: {
        showStartupMessage: false,
        startupMessageFormat: 'simple',
        timestamp: {
          translateTime: 'yyyy-mm-dd HH:MM:ss.SSS',
        },
        ip: true,
        customLogFormat: '🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip}',
      },
    }),
  )
  .use(
    elysiaHelmet({
      csp: {
        defaultSrc: [permission.SELF],
        scriptSrc: [permission.SELF, permission.UNSAFE_INLINE],
        styleSrc: [permission.SELF, permission.UNSAFE_INLINE],
        imgSrc: [permission.SELF, permission.DATA, permission.HTTPS],
        useNonce: true,
      },
      hsts: {
        maxAge: 31_536_000,
        includeSubDomains: true,
        preload: true,
      },
      frameOptions: 'DENY',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        camera: [permission.NONE],
        microphone: [permission.NONE],
      },
    }),
  )
  .use(ip())
  .use(
    serverTiming({
      trace: {
        request: true,
        parse: true,
        transform: true,
        beforeHandle: true,
        handle: true,
        afterHandle: true,
        error: true,
        mapResponse: true,
        total: true,
      },
    }),
  )
  .use(
    cors({
      origin: CORS_ORIGINS,
      methods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
      exposeHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86_400,
      credentials: true,
    }),
  )
  .use(
    rateLimit({
      duration: RATE_LIMIT.duration,
      max: RATE_LIMIT.max,
      headers: true,
      scoping: 'scoped',
      countFailedRequest: true,
      errorResponse: new Response(
        stringify({
          error: 'Too many requests',
        }),
        { status: 429 },
      ),
      generator: ipGenerator,
    }),
  )
  .use(errorMiddleware)
  .use(routes);

/**
 * Root application with Swagger documentation
 */
export const root = new Elysia()
  .use(
    swagger({
      path: '/swagger',
      documentation: {
        info: {
          title: '🦊 GDSC Farmingdale API',
          version: '1.0.0',
          description: `
**GDSC Farmingdale Links API**

API for accessing GDG on Campus Farmingdale State College events.

- 🚀 Built with [ElysiaJS](https://elysiajs.com)
- 🔒 Security (Helmet, Rate Limiting, CORS)
- 📝 Auto-generated OpenAPI docs

> **Contact:** [Mike Odnis](mailto:mikeodnis3242004@gmail.com)
          `,
          contact: {
            name: 'Mike Odnis',
            email: 'mikeodnis3242004@gmail.com',
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
          },
        },
        tags: [
          { name: 'Events', description: 'Event endpoints for upcoming and past events' },
          { name: 'Health', description: 'Health check endpoints' },
          { name: 'Utility', description: 'Utility endpoints for status and info' },
          { name: 'Info', description: 'API information endpoints' },
        ],
      },
    }),
  )
  .use(app);

export type App = typeof app;
