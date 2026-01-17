import { staticPlugin } from '@elysiajs/static';
import { root } from './app';
import { PORT, SCRAPE_INTERVAL_MS } from './config';
import { saveEventsToFile } from './services/file-handler.service';
import { scrapePastEvents, scrapeUpcomingEvents } from './services/scraper.service';

console.log('🚀 Starting GDSC Farmingdale Links API...');

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
// We await the plugin initialization, then use it
const staticFiles = await staticPlugin({
  assets: 'public',
  prefix: '/'
});
root.use(staticFiles);

// Start the server
root.listen({ port: PORT, hostname: '0.0.0.0' }, ({ hostname, port }) => {
  console.info(`🦊 Elysia is running at http://${hostname}:${port}`);
  console.info(`📚 Swagger docs at http://${hostname}:${port}/swagger`);
});

// Run initial scrape
runScrape();

// Schedule periodic scrape
setInterval(runScrape, SCRAPE_INTERVAL_MS);

export { root };
export type App = typeof root;
