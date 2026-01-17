import { staticPlugin } from '@elysiajs/static';
import { root } from './app';
export { root, root as default } from './app';
import { PORT, SCRAPE_INTERVAL_MS } from './config';
import { saveEventsToFile } from './services/file-handler.service';
import { scrapePastEvents, scrapeUpcomingEvents } from './services/scraper.service';

/**
 * Run the event scraper and save results to files
 */
const runScrape = async (): Promise<void> => {
  console.log('Scraping events...');
  try {
    const [upcomingEvents, pastEvents] = await Promise.all([
      scrapeUpcomingEvents(),
      scrapePastEvents(),
    ]);

    saveEventsToFile(upcomingEvents, '../data/upcoming-events.json');
    saveEventsToFile(pastEvents, '../data/past-events.json');

    console.log(`Scraped ${upcomingEvents.length} upcoming events and ${pastEvents.length} past events`);
  } catch (error) {
    console.error('Error during scrape:', error);
  }
};

// Configure static plugin for Fullstack Dev Server
// This must be awaited to enable HMR hooks
await root.use(await staticPlugin({
  assets: 'public',
  prefix: '/'
}));

// Start the server if running directly (not as a module/worker)
if (import.meta.main) {
    root.listen({ port: PORT, hostname: '0.0.0.0' }, ({ hostname, port }) => {
      console.info(`🦊 Elysia is running at http://${hostname}:${port}`);
      console.info(`📚 Swagger docs at http://${hostname}:${port}/swagger`);
    });

    // Run initial scrape
    runScrape();

    // Schedule periodic scrape
    setInterval(runScrape, SCRAPE_INTERVAL_MS);
}

export type App = typeof root;
