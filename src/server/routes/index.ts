import { Elysia } from 'elysia';
import { eventsRoute } from './events.route';
import { healthRoute } from './health.route';
import { utilityRoute } from './utility.route';

/**
 * Route aggregator - combines all routes
 */
export const routes = new Elysia()
  .use(utilityRoute)
  .use(eventsRoute)
  .use(healthRoute);
