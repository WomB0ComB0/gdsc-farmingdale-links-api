import fs from 'fs';
import path from 'path';

type Events = {
    title: string | null;
    thumbnailLink: string | null;
    detailsLink: string | null;
};

const dataDirectory: string = './dist/data'

export const saveEventsToFile = async (events: Events[], filePath: string, constantName: string) => {
    try {
        const filteredEvents = events.filter(
            (event) => event.title !== null && event.thumbnailLink !== null && event.detailsLink !== null
        );

        try {
            await fs.promises.mkdir(dataDirectory);
        } catch (mkdirError: any) {
            if (mkdirError.code !== 'EEXIST') {
                throw mkdirError;
            }
        }

        const outputPath = path.resolve(__dirname, filePath);
        const json = JSON.stringify(filteredEvents, null, 2);
        const fileContent = `const ${constantName} = ${json};\nexport default ${constantName};`;

        await fs.promises.writeFile(outputPath, fileContent, 'utf8');
        console.log(`Events successfully written to ${filePath}`);
    } catch (error) {
        console.error(`Error saving events to ${filePath}:`, error);
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
