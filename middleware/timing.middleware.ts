import { Elysia } from 'elysia';

/**
 * Timing middleware - logs request duration
 */
export const timingMiddleware = new Elysia({ name: 'timing' })
  .state({ start: 0 })
  .onBeforeHandle(({ store }) => {
    store.start = Date.now();
  })
  .onAfterHandle(({ path, store: { start } }) => {
    console.info(`[Elysia] ${path} took ${Date.now() - start}ms`);
  });
