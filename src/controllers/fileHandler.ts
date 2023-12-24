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
    const file_Path = path.resolve(__dirname, filePath);

    if (!fs.existsSync(file_Path)) {
      console.error(`File does not exist: ${file_Path}`);
      return [];
    }
    const fileContent = fs.readFileSync(file_Path, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    return jsonData;
  } catch (error) {
    console.error(`An error occurred reading the ${filePath} file:`, error);
    throw error;
  }
};
