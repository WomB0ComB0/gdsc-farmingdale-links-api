import ogs from 'open-graph-scraper';
import puppeteer from "puppeteer";
import { College } from "../constant/index";

type Events = {
	title: string | null;
	thumbnailLink: string | null;
	detailsLink: string | null;
};

export const scrapeEvents = async (): Promise<Events[]> => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	await page.goto(`https://gdg.community.dev/${College}/`, { timeout: 0, waitUntil: "networkidle2" });
	await new Promise((r) => setTimeout(r, 3000));

	const events = await page.evaluate(() => {
		// Find the "Upcoming events" section - look for the heading then get its sibling container
		const upcomingHeading = Array.from(document.querySelectorAll('h1')).find(
			h => h.textContent?.includes('Upcoming events')
		);

		if (!upcomingHeading) return [];

		// Get the parent container and find event cards within it
		const section = upcomingHeading.closest('[data-testid^="container-block-"]');
		if (!section) return [];

		// Look for event card links (they are anchor tags with event details)
		const eventCards = section.querySelectorAll('a[data-testid^="container-block-"]');
		const eventsArray: { title: string | null; thumbnailLink: string | null; detailsLink: string | null; eventType: string; date: string; }[] = [];

		for (const elem of eventCards) {
			const thumbnailLink = elem.querySelector("img")?.getAttribute("src") || null;
			const detailsLink = (elem as HTMLAnchorElement).href || null;

			// Get the event title from the link inside the card
			const titleLink = elem.querySelector("a.link-styles__link_1ec3q");
			const title = titleLink?.textContent?.trim() || "";

			// Get event type (e.g., "Workshop / Study Group")
			const eventTypeElement = elem.querySelector('[data-testid="container-block-VDLl86XLOx3"] strong');
			const eventType = eventTypeElement?.textContent?.trim() || "";

			// Get the date
			const dateElement = elem.querySelector('[data-testid="new-text-block-PcxJt48CLy"] span');
			const date = dateElement?.textContent?.trim() || "";

			if (detailsLink?.includes('gdg.community.dev/events')) {
				eventsArray.push({
					title,
					thumbnailLink,
					detailsLink,
					eventType,
					date,
				});
			}
		}

		return eventsArray;
	});

	await browser.close();

	const results: Events[] = [];
	for (const event of events) {
		let title = event.title;
		// If no title found in DOM, try fetching from OG tags
		if (!title && event.detailsLink) {
			try {
				const ogResult = await ogs({
					url: event.detailsLink,
					fetchOptions: {
						headers: {
							'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
						},
					}
				});
				title = ogResult.result.ogTitle || "";
			} catch {
				title = "";
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

export const scrapePastEvents = async (): Promise<Events[]> => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	await page.goto(`https://gdg.community.dev/${College}/`, { timeout: 0, waitUntil: "networkidle2" });
	await new Promise((r) => setTimeout(r, 3000));

	const events = await page.evaluate(() => {
		// Find the "Past events" section - look for the data block specifically for past events
		const pastEventsContainer = document.querySelector('[data-testid^="data-block-for-pastEvents-"]');

		if (!pastEventsContainer) {
			// Fallback: find section by heading
			const pastHeading = Array.from(document.querySelectorAll('h1')).find(
				h => h.textContent?.includes('Past events')
			);
			if (!pastHeading) return [];

			const section = pastHeading.closest('[data-testid^="container-block-"]');
			if (!section) return [];
		}

		const container = pastEventsContainer || document.querySelector('[data-testid^="container-block-qJkhqi"]');
		if (!container) return [];

		// Event cards are anchor tags within the past events container
		const eventCards = container.querySelectorAll('a[data-testid^="container-block-"]');
		const eventsArray: { title: string | null; thumbnailLink: string | null; detailsLink: string | null; eventType: string; date: string; }[] = [];

		for (const elem of eventCards) {
			const thumbnailLink = elem.querySelector("img")?.getAttribute("src") || null;
			const detailsLink = (elem as HTMLAnchorElement).href || null;

			// Get the event title from the link inside the card
			const titleLink = elem.querySelector("a.link-styles__link_1ec3q");
			const title = titleLink?.textContent?.trim() || "";

			// Get event type (e.g., "Workshop / Study Group")
			const eventTypeElement = elem.querySelector('[data-testid="container-block-VDLl86XLOx3"] strong');
			const eventType = eventTypeElement?.textContent?.trim() || "";

			// Get the date
			const dateElement = elem.querySelector('[data-testid="new-text-block-PcxJt48CLy"] span');
			const date = dateElement?.textContent?.trim() || "";

			if (detailsLink?.includes('gdg.community.dev/events')) {
				eventsArray.push({
					title,
					thumbnailLink,
					detailsLink,
					eventType,
					date,
				});
			}
		}

		return eventsArray;
	});

	await browser.close();

	const results: Events[] = [];
	for (const event of events) {
		let title = event.title;
		// If no title found in DOM, try fetching from OG tags
		if (!title && event.detailsLink) {
			try {
				const ogResult = await ogs({
					url: event.detailsLink,
					fetchOptions: {
						headers: {
							'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
						},
					}
				});
				title = ogResult.result.ogTitle || "";
			} catch {
				title = "";
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
