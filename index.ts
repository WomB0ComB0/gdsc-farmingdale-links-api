import { staticPlugin } from '@elysiajs/static';
import { root } from './app';
import { PORT, SCRAPE_INTERVAL_MS } from './config';
import { saveEventsToFile } from './services/file-handler.service';
import { scrapePastEvents, scrapeUpcomingEvents } from './services/scraper.service';

// Don't export root as default - Bun HMR will try to Bun.serve() it!
export { root } from './app';
export type App = typeof root;

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

    saveEventsToFile(upcomingEvents, './data/upcoming-events.json');
    saveEventsToFile(pastEvents, './data/past-events.json');

    console.log(
      `Scraped ${upcomingEvents.length} upcoming events and ${pastEvents.length} past events`,
    );
  } catch (error) {
    console.error('Error during scrape:', error);
  }
};

// Only start server when running directly (not as a module/worker)
if (import.meta.main) {
  // Configure static plugin
  root.use(
    staticPlugin({
      assets: 'public',
      prefix: '/',
    }),
  );

  // Start the server
  root.listen(PORT);

  console.info(`🦊 Elysia is running at http://localhost:${PORT}`);
  console.info(`📚 Swagger docs at http://localhost:${PORT}/swagger`);

  // Delay scrape to ensure server is fully initialized
  setTimeout(() => {
    runScrape();
    setInterval(runScrape, SCRAPE_INTERVAL_MS);
  }, 2000);
}
