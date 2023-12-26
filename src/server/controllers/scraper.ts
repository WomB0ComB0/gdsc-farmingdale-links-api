import axios from 'axios';
import { load } from 'cheerio';
import puppeteer from 'puppeteer';
import { College } from '../constant/index';

type Events = {
    title: string | null;
    thumbnailLink: string | null;
    detailsLink: string | null;
};

export const scrapeEvents = async (): Promise<Events[]> => {
    const response = await axios.get(`https://gdsc.community.dev/${College}/`);
    const html = response.data;
    const $ = load(html);

    const events: Events[] = [];

    $('#--ruSKZrkro').each((_i, elem) => {
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

export const scrapePastEvents = async (): Promise<Events[]> => {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();

    await page.goto(`https://gdsc.community.dev/${College}/`);
    // Wait for some time to ensure dynamic content is loaded (you might need to adjust the time)
    await new Promise(r => setTimeout(r, 5000));

    const events = await page.evaluate(() => {
        const eventElements = document.querySelectorAll('[data-testid="container-block-24RneQKmFRW"]');
        const eventsArray: Events[] = [];

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
