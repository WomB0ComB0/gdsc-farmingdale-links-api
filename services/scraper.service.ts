import ogs from 'open-graph-scraper';
import puppeteer from 'puppeteer';
import { COLLEGE } from '../config';
import type { Event } from '../types/events.type';

/**
 * Scrapes upcoming events from the GDG community page.
 */
export const scrapeUpcomingEvents = async (): Promise<Event[]> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://gdg.community.dev/${COLLEGE}/`, {
    timeout: 0,
    waitUntil: 'networkidle2',
  });
  await new Promise((r) => setTimeout(r, 3000));

  const events = await page.evaluate(() => {
    const upcomingHeading = Array.from(document.querySelectorAll('h1')).find((h) =>
      h.textContent?.includes('Upcoming events'),
    );

    if (!upcomingHeading) return [];

    const section = upcomingHeading.closest('[data-testid^="container-block-"]');
    if (!section) return [];

    const eventCards = section.querySelectorAll('a[data-testid^="container-block-"]');
    const eventsArray: {
      title: string | null;
      thumbnailLink: string | null;
      detailsLink: string | null;
      eventType: string;
    }[] = [];

    for (const elem of eventCards) {
      const thumbnailLink = elem.querySelector('img')?.getAttribute('src') || null;
      const detailsLink = (elem as HTMLAnchorElement).href || null;

      const titleLink = elem.querySelector('a.link-styles__link_1ec3q');
      const title = titleLink?.textContent?.trim() || '';

      const eventTypeElement = elem.querySelector(
        '[data-testid="container-block-VDLl86XLOx3"] strong',
      );
      const eventType = eventTypeElement?.textContent?.trim() || '';

      if (detailsLink?.includes('gdg.community.dev/events')) {
        eventsArray.push({ title, thumbnailLink, detailsLink, eventType });
      }
    }

    return eventsArray;
  });

  await browser.close();

  const results: Event[] = [];
  for (const event of events) {
    let title = event.title;
    if (!title && event.detailsLink) {
      try {
        const ogResult = await ogs({
          url: event.detailsLink,
          fetchOptions: {
            headers: {
              'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            },
          },
        });
        title = ogResult.result.ogTitle || '';
      } catch {
        title = '';
      }
    }
    const fullTitle = event.eventType && title ? `${title} - ${event.eventType}` : title;
    results.push({
      title: fullTitle || null,
      thumbnailLink: event.thumbnailLink,
      detailsLink: event.detailsLink,
    });
  }

  return results;
};

/**
 * Scrapes past events from the GDG community page.
 */
export const scrapePastEvents = async (): Promise<Event[]> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`https://gdg.community.dev/${COLLEGE}/`, {
    timeout: 0,
    waitUntil: 'networkidle2',
  });
  await new Promise((r) => setTimeout(r, 3000));

  const events = await page.evaluate(() => {
    const pastEventsContainer = document.querySelector(
      '[data-testid^="data-block-for-pastEvents-"]',
    );

    if (!pastEventsContainer) {
      const pastHeading = Array.from(document.querySelectorAll('h1')).find((h) =>
        h.textContent?.includes('Past events'),
      );
      if (!pastHeading) return [];

      const section = pastHeading.closest('[data-testid^="container-block-"]');
      if (!section) return [];
    }

    const container =
      pastEventsContainer || document.querySelector('[data-testid^="container-block-qJkhqi"]');
    if (!container) return [];

    const eventCards = container.querySelectorAll('a[data-testid^="container-block-"]');
    const eventsArray: {
      title: string | null;
      thumbnailLink: string | null;
      detailsLink: string | null;
      eventType: string;
    }[] = [];

    for (const elem of eventCards) {
      const thumbnailLink = elem.querySelector('img')?.getAttribute('src') || null;
      const detailsLink = (elem as HTMLAnchorElement).href || null;

      const titleLink = elem.querySelector('a.link-styles__link_1ec3q');
      const title = titleLink?.textContent?.trim() || '';

      const eventTypeElement = elem.querySelector(
        '[data-testid="container-block-VDLl86XLOx3"] strong',
      );
      const eventType = eventTypeElement?.textContent?.trim() || '';

      if (detailsLink?.includes('gdg.community.dev/events')) {
        eventsArray.push({ title, thumbnailLink, detailsLink, eventType });
      }
    }

    return eventsArray;
  });

  await browser.close();

  const results: Event[] = [];
  for (const event of events) {
    let title = event.title;
    if (!title && event.detailsLink) {
      try {
        const ogResult = await ogs({
          url: event.detailsLink,
          fetchOptions: {
            headers: {
              'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            },
          },
        });
        title = ogResult.result.ogTitle || '';
      } catch {
        title = '';
      }
    }
    const fullTitle = event.eventType && title ? `${title} - ${event.eventType}` : title;
    results.push({
      title: fullTitle || null,
      thumbnailLink: event.thumbnailLink,
      detailsLink: event.detailsLink,
    });
  }

  return results;
};
