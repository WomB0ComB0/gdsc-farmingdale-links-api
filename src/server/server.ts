import path from "path";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { rateLimit } from "express-rate-limit";
import ViteExpress from "vite-express";
import { saveEventsToFile } from "./controllers/fileHandler";
import { scrapeEvents, scrapePastEvents } from "./controllers/scraper";
import pastEventsRouter from "./routes/pastEvents";
import upcomingEventsRouter from "./routes/upcomingEvents";
import healthRouter from "./routes/health";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => req.path === "/api/health", // Skip rate limiting for health checks
});

const app = express();
const port = parseInt(process.env.PORT as string, 10) || 3000;

app.set('trust proxy', false);

const domains = "https://gdsc-fsc-l.web.app,https://gdg-fsc.web.app"

const corsOptions = {
  origin: domains,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

app.options("/api", (_req: Request, res: Response) => {
  res.status(200).end();
});

app.options("/api/health", (_req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

app.options("/api/upcoming-events", (_req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

app.options("/api/past-events", (_req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

app.disable("x-powered-by");

app.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "Use /api/upcoming-events or /api/past-events" });
});

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", domains);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use("/api/upcoming-events", limiter, upcomingEventsRouter);
app.use("/api/past-events", limiter, pastEventsRouter);
app.use("/api/health", limiter, healthRouter);

// app.use(errorHandler);

const weeklyScrape = async () => {
  console.log("Weekly scrape started...");

  const currentEvents = await scrapeEvents();
  const pastEvents = await scrapePastEvents();

  saveEventsToFile(currentEvents, "../data/upcoming-events.json");
  saveEventsToFile(pastEvents, "../data/past-events.json");

  console.log("Weekly scrape complete!");
};

setInterval(weeklyScrape, 24 * 60 * 60 * 1000);

const server = ViteExpress.listen(app, port, async () => {
  console.log(`Server started on http://localhost:${port}/`);

  console.log("Initial scrape started...");
  const initialUpcomingEvents = await scrapeEvents();
  const initialPastEvents = await scrapePastEvents();

  saveEventsToFile(initialUpcomingEvents, "../data/upcoming-events.json");
  saveEventsToFile(initialPastEvents, "../data/past-events.json");

  console.log("Initial scrape complete!");
});

export { server, app };
