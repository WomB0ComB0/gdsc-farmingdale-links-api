import { root } from './app';
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

/**
 * Graceful shutdown handler
 */
const shutdown = async (): Promise<void> => {
  console.info('Shutting down 🦊 Elysia');
  await root.stop();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

/**
 * Start the server
 */
const start = async (): Promise<void> => {
  // Start the server
  root.listen({ port: PORT, hostname: '0.0.0.0' });

  console.info(`🦊 Elysia is running at http://localhost:${PORT}`);
  console.info(`📚 Swagger docs at http://localhost:${PORT}/swagger`);

  // Run initial scrape
  console.log('Running initial scrape...');
  await runScrape();
  console.log('Initial scrape complete!');

  // Schedule periodic scrape (every 24 hours)
  setInterval(runScrape, SCRAPE_INTERVAL_MS);
};

start();

export { root };
