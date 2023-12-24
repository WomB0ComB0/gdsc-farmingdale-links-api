import express, { Application, Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { NotFound } from "http-errors";
import path from 'path';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import { errorHandler } from './middleware/errors';
import { scrapeEvents, scrapePastEvents } from './controllers/scraper';
import { saveEventsToFile } from './controllers/fileHandler';
import upcomingEventsRouter from './routes/upcomingEvents';
import pastEventsRouter from './routes/pastEvents';

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});

export const server: Application = express();
const PORT = process.env.PORT || 3000;

server.use(cors())
server.disable("trust proxy");
server.disable("x-powered-by");

server.use(json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, "../public")));

server.get("/", (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send("index.html");
  } catch (error) {
    next(error);
  }
});

server.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "Use /api/upcoming-events or /api/past-events" });
});

server.use('/api/upcoming-events', limiter, upcomingEventsRouter);
server.use('/api/past-events', limiter, pastEventsRouter);

server.get("*", function () {
  throw new NotFound();
});

server.use(errorHandler);

const weeklyScrape = async () => {
  console.log('Weekly scrape started...');

  const currentEvents = await scrapeEvents();
  const pastEvents = await scrapePastEvents();

  saveEventsToFile(currentEvents, 'upcomingEvents', '../data/upcoming-events.js');
  saveEventsToFile(pastEvents, 'pastEvents','../data/past-events.js');

  console.log('Weekly scrape complete!');
};

setInterval(weeklyScrape, 7 * 24 * 60 * 60 * 1000);

server.listen(PORT, async () => {
  console.log(`Server started on http://localhost:${PORT}/`);

  console.log('Initial scrape started...');
  const initialUpcomingEvents = await scrapeEvents();
  const initialPastEvents = await scrapePastEvents();

  saveEventsToFile(initialUpcomingEvents, 'upcomingEvents','../data/upcoming-events.js');
  saveEventsToFile(initialPastEvents, 'pastEvents','../data/past-events.js');

  console.log('Initial scrape complete!');
});
