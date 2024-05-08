import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

type Events = {
	title: string | null;
	thumbnailLink: string | null;
	detailsLink: string | null;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveEventsToFile = (events: Events[], filePath: string) => {
	const filteredEvents = events.filter(
		(event) =>
			event.title !== null &&
			event.thumbnailLink !== null &&
			event.detailsLink !== null,
	);

	const outputPath = path.resolve(__dirname, filePath);
	fs.writeFileSync(outputPath, JSON.stringify(filteredEvents, null, 2));
};

export const readEventsFromFile = (filePath: string) => {
	try {
		const data = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
		return JSON.parse(data);
	} catch (error) {
		console.error(`An error occurred reading the ${filePath} file:`, error);
		throw error;
	}
};
