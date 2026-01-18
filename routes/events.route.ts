import { Elysia, t } from 'elysia';
import { readEventsFromFile } from '../services/file-handler.service';

const stringify = (o: object): string => JSON.stringify(o, null, 2);

const EventSchema = t.Object({
  title: t.Nullable(t.String()),
  thumbnailLink: t.Nullable(t.String()),
  detailsLink: t.Nullable(t.String()),
});

/**
 * Events routes - upcoming and past events
 */
export const eventsRoute = new Elysia({ prefix: '/events' })
  .get(
    '/upcoming',
    () => {
      console.log('Requested upcoming events');
      const data = readEventsFromFile('./data/upcoming-events.json');
      return data;
    },
    {
      detail: {
        summary: 'Get upcoming events',
        description: 'Returns a list of upcoming GDG events',
        tags: ['Events'],
      },
      response: t.Array(EventSchema),
    },
  )
  .head('/upcoming', ({ set }) => {
    set.status = 200;
  })
  .options('/upcoming', () =>
    stringify({
      message: 'CORS preflight response',
      status: 204,
      allow: 'GET,OPTIONS,HEAD',
    }),
  )
  .get(
    '/past',
    () => {
      console.log('Requested past events');
      const data = readEventsFromFile('./data/past-events.json');
      return data;
    },
    {
      detail: {
        summary: 'Get past events',
        description: 'Returns a list of past GDG events',
        tags: ['Events'],
      },
      response: t.Array(EventSchema),
    },
  )
  .head('/past', ({ set }) => {
    set.status = 200;
  })
  .options('/past', () =>
    stringify({
      message: 'CORS preflight response',
      status: 204,
      allow: 'GET,OPTIONS,HEAD',
    }),
  );
