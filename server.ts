import { errorHandler } from './src/middleware/errors';
import express, { Application } from 'express';
import { json } from 'body-parser';
import path from 'path';
import { scrapeEvents, scrapePastEvents } from './src/controllers/scraper';
import { saveEventsToFile } from './src/controllers/fileHandler';
import upcomingEventsRouter from './src/routes/upcomingEvents';
import pastEventsRouter from './src/routes/pastEvents';

const server: Application = express();
console.log('Server started');
const PORT = process.env.PORT || 3000;

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');

server.use(json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, 'dist')));

server.use('/api/upcoming-events', upcomingEventsRouter);
server.use('/api/past-events', pastEventsRouter);

server.use(errorHandler);

setInterval(
	async () => {
		console.log(
			'Weekly scrape started...'
		);

		const currentEvents =
			await scrapeEvents();
		const pastEvents =
			await scrapePastEvents();

		saveEventsToFile(
			currentEvents,
			'../data/upcoming-events.json'
		);
		saveEventsToFile(
			pastEvents,
			'../data/past-events.json'
		);

		console.log(
			'Daily scrape complete!'
		);
	},
	24 *
		60 *
		60 *
		1000
);

server.listen(PORT, async () => {
	console.log(
		`Server started on http://localhost:${PORT}/events`
	);

	console.log(
		'Initial scrape started...'
	);
	const initialUpcomingEvents =
		await scrapeEvents();
	const initialPastEvents =
		await scrapePastEvents();

	saveEventsToFile(
		initialUpcomingEvents,
		'../data/upcoming-events.json'
	);
	saveEventsToFile(
		initialPastEvents,
		'../data/past-events.json'
	);

	console.log(
		'Initial scrape complete!'
	);
});

export default server;
