import fs from 'fs';
import path from 'path';

type Events = {
    title: string | null;
    thumbnailLink: string | null;
    detailsLink: string | null;
};

const dataDirectory: string = './dist/data'

export const saveEventsToFile = async (events: Events[], filePath: string) => {
  const filteredEvents = events.filter(
    (event) => event.title !== null && event.thumbnailLink !== null && event.detailsLink !== null
  );
  try {
    try {
      await fs.promises.mkdir(dataDirectory);
    } catch (mkdirError: any) {
      if (mkdirError.code !== 'EEXIST') {
        throw mkdirError;
      }
    }
    const outputPath = path.resolve(__dirname, filePath);
    fs.writeFileSync(outputPath, JSON.stringify(filteredEvents, null, 2));
  } catch (error: any) {
    console.error(`An error occurred writing the ${filePath} file:`, error);
    throw error;
  }
};


export const readEventsFromFile = async (filePath: string) => {
    try {
        try {
            await fs.promises.mkdir(dataDirectory);
        } catch (mkdirError: any) {
            if (mkdirError.code !== 'EEXIST') {
                throw mkdirError;
            }
        }

        const fileContent = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8');
        const jsonData = JSON.parse(fileContent);
        return jsonData;
    } catch (error) {
        console.error(`An error occurred reading the ${filePath} file:`, error);
        throw error;
    }
};
