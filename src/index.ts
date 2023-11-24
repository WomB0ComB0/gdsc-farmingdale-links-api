import express from 'express';
import axios from 'axios';
import { load } from 'cheerio';
import puppeteer from 'puppeteer';
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
    const response = await axios.get('https://gdsc.community.dev/farmingdale-state-college/');
    const html = response.data;
    const $ = load(html);

    const events: Event[] = [];

    $('#--ruSKZrkro').each((i, elem) => {
        const title = $(elem).find('div.dynamic-text').text().trim() || $(elem).find('div.dynamic-text div').text().trim();

        const thumbnailLink = $(elem).find('img').attr('src') || null;
        const detailsLink = $(elem).find('a.link-styles__link_1ec3q').attr('href') || null;

        events.push({
            title,
            thumbnailLink,
            detailsLink
        });
    });

    return events;
};


const scrapePastEvents = async (): Promise<Event[]> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://gdsc.community.dev/farmingdale-state-college/');
    // Wait for some time to ensure dynamic content is loaded (you might need to adjust the time)
    await page.waitForTimeout(5000);

    const events = await page.evaluate(() => {
        const eventElements = document.querySelectorAll('[data-testid="container-block-24RneQKmFRW"]');
        const eventsArray: Event[] = [];

        eventElements.forEach((elem) => {
            const titleElement = elem.querySelector('a.link-styles__link_1ec3q .dynamic-text');
            const title = titleElement?.textContent?.replace(/^\s*\w+\s+\d+,\s+\d+\s*-\s*/, '').trim() || '';
            const thumbnailLink = elem.querySelector('img')?.src || null;
            const detailsLink = (elem.querySelector('a.link-styles__link_1ec3q') as HTMLAnchorElement)?.href || null;

            eventsArray.push({
                title,
                thumbnailLink,
                detailsLink,
            });
        });

        return eventsArray;
    });

    browser.close();
    return events;
};

const saveUpcomingEventsToFile = (events: Event[]) => {
    const filteredEvents = events.filter(event => (
        event.title !== null || event.thumbnailLink !== null || event.detailsLink !== null
    ));

    const outputPath = path.resolve(__dirname, 'upcoming-events.json');
    fs.writeFileSync(outputPath, JSON.stringify(filteredEvents, null, 2));
};

const savePastEventsToFile = (events: Event[]) => {
    const filteredEvents = events.filter(event => (
        event.title !== null && "" || event.thumbnailLink !== null || event.detailsLink !== null
    ));

    const outputPath = path.resolve(__dirname, 'past-events.json');
    fs.writeFileSync(outputPath, JSON.stringify(filteredEvents, null, 2));
};



app.get('/upcoming-events', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log('Requested upcoming events');
    try {
        const data = fs.readFileSync(path.resolve(__dirname, 'upcoming-events.json'), 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('An error occurred reading the upcoming events file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/past-events', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log('Requested past events');
    try {
        const data = fs.readFileSync(path.resolve(__dirname, 'past-events.json'), 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('An error occurred reading the past events file:', error);
        res.status(500).send('Internal Server Error');
    }
});

setInterval(async () => {
    console.log('Weekly scrape started...');

    const currentEvents = await scrapeEvents();
    const pastEvents = await scrapePastEvents();

    saveUpcomingEventsToFile(currentEvents);
    savePastEventsToFile(pastEvents);

    console.log('Daily scrape complete!');
}, 24 * 60 * 60 * 1000);

app.listen(PORT, async () => {
    console.log(`Server started on http://localhost:${PORT}/events`);

    console.log('Initial scrape started...');
    const initialUpcomingEvents = await scrapeEvents();
    const initialPastEvents = await scrapePastEvents();

    saveUpcomingEventsToFile(initialUpcomingEvents);
    savePastEventsToFile(initialPastEvents);

    console.log('Initial scrape complete!');
});
