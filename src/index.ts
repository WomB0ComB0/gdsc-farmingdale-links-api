import express from 'express';
import axios from 'axios';
import {load} from 'cheerio';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

type Event = {
    title: string | null;
    thumbnailLink: string | null;
    detailsLink: string | null;
};

const scrapeEvents = async (): Promise<Event[]> => {
    const response = await axios.get('https://gdsc.community.dev/william-mary/');
    const html = response.data;
    const $ = load(html);

    const events: Event[] = [];

    $('div.col-md-12').each((i, elem) => {
        const title = $(elem).find('h4.general-body--color').text();
        const thumbnailLink = $(elem).find('a.picture').attr('href') || null;
        const detailsLink = $(elem).find('.btn.btn-primary.purchase-ticket').attr('href') || null;

        events.push({
            title,
            thumbnailLink,
            detailsLink
        });
    });

    return events;
};

const saveEventsToFile = (events: Event[]) => {
    const outputPath = path.resolve(__dirname, 'events.json');
    fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));
};

app.get('/events', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); // you would want to change the * to the website
    console.log('Requested events');
    try {
        const data = fs.readFileSync(path.resolve(__dirname, 'events.json'), 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('An error occurred reading the events file:', error);
        res.status(500).send('Internal Server Error');
    }
});

setInterval(async () => {
    console.log('Weekly scrape started...');
    const events = await scrapeEvents();
    saveEventsToFile(events);
    console.log('Weekly scrape complete!');
}, 7 * 24 * 60 * 60 * 1000);

app.listen(PORT, async () => {
    console.log(`Server started on http://localhost:${PORT}/events`);

    console.log('Initial scrape started...');
    const initialEvents = await scrapeEvents();
    saveEventsToFile(initialEvents);
    console.log('Initial scrape complete!');
});
