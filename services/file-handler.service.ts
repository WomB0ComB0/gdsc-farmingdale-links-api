import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Event } from '../types/events.type';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Saves events to a JSON file.
 */
export const saveEventsToFile = (events: Event[], filePath: string): void => {
  const filteredEvents = events.filter(
    (event) =>
      event.title !== null && event.thumbnailLink !== null && event.detailsLink !== null,
  );

  const outputPath = path.resolve(__dirname, filePath);
  fs.writeFileSync(outputPath, JSON.stringify(filteredEvents, null, 2));
};

/**
 * Reads events from a JSON file.
 */
export const readEventsFromFile = (filePath: string): Event[] => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8');
    return JSON.parse(data) as Event[];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};
