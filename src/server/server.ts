import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import { scrapeEvents, scrapePastEvents } from './controllers/scraper';
import { saveEventsToFile } from './controllers/fileHandler';
import upcomingEventsRouter from './routes/upcomingEvents';
import pastEventsRouter from './routes/pastEvents';
import ViteExpress from "vite-express";


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7',
	legacyHeaders: false,
});

const server = express();
const port = parseInt(process.env.PORT!) || 3000;

const corsOptions = {
  origin:  'https://gdsc-fsc-l.web.app',
  credentials: true,
  optionSuccessStatus: 200
}

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cors(corsOptions))


server.options(
  "/api",
  (_req: Request, res: Response) => {
    res.status(200).end();
  }
);

server.options('/api/upcoming-events' ,(_req: Request ,res: Response) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
})

server.options('/api/past-events' ,(_req: Request ,res: Response) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
})

server.disable("x-powered-by");

server.use(express.static(path.join(__dirname, "../public")));

server.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "Use /api/upcoming-events or /api/past-events" });
});

server.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'https://gdsc-fsc-l.web.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next()
})
server.use('/api/upcoming-events', limiter, upcomingEventsRouter);
server.use('/api/past-events', limiter, pastEventsRouter);

// server.use(errorHandler);

const weeklyScrape = async () => {
  console.log('Weekly scrape started...');

  const currentEvents = await scrapeEvents();
  const pastEvents = await scrapePastEvents();

  saveEventsToFile(currentEvents, '../data/upcoming-events.json');
  saveEventsToFile(pastEvents, '../data/past-events.json');

  console.log('Weekly scrape complete!');
};

setInterval(weeklyScrape, 7 * 24 * 60 * 60 * 1000);

ViteExpress.listen(server, port, async () => {
  console.log(`Server started on http://localhost:${port}/`);

  console.log('Initial scrape started...');
  const initialUpcomingEvents = await scrapeEvents();
  const initialPastEvents = await scrapePastEvents();

  saveEventsToFile(initialUpcomingEvents, '../data/upcoming-events.json');
  saveEventsToFile(initialPastEvents, '../data/past-events.json');

  console.log('Initial scrape complete!');
});
