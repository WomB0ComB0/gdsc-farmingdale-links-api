import fs from 'node:fs';
import path from 'node:path';
import type { Event } from '../types/events.type';

// Use process.cwd() to get the project root directory
const projectRoot = process.cwd();

/**
 * Saves events to a JSON file.
 */
export const saveEventsToFile = (events: Event[], filePath: string): void => {
  const filteredEvents = events.filter(
    (event) => event.title !== null && event.thumbnailLink !== null && event.detailsLink !== null,
  );

  const outputPath = path.resolve(projectRoot, filePath);

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(filteredEvents, null, 2));
};

/**
 * Reads events from a JSON file.
 */
export const readEventsFromFile = (filePath: string): Event[] => {
  try {
    const data = fs.readFileSync(path.resolve(projectRoot, filePath), 'utf-8');
    return JSON.parse(data) as Event[];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};
