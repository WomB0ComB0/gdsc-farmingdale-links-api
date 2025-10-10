import axios from "axios";
import { load } from "cheerio";
import puppeteer from "puppeteer";
import { College } from "../constant/index";
import ogs from 'open-graph-scraper';

type Events = {
	title: string | null;
	thumbnailLink: string | null;
	detailsLink: string | null;
};

export const scrapeEvents = async (): Promise<Events[]> => {
	const response = await axios.get(`https://gdg.community.dev/${College}/`);
	const html = response.data;
	const $ = load(html);

	const events: Events[] = [];

	$('div[data-testid="container-block---ruSKZrkro"]').each((_i, elem) => {
		const title = $(elem).find('div[data-testid="container-block-W0gqHO2Eqnc"] strong')
			.text()
			.trim();

		const thumbnailLink = $(elem).find('img').attr('src') || null;
		const detailsLink = $(elem).find('a.link-styles__link_1ec3q').attr('href') || null;

		events.push({
			title,
			thumbnailLink,
			detailsLink,
		});
	});

	return events;
};

export const scrapePastEvents = async (): Promise<Events[]> => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	await page.goto(`https://gdg.community.dev/${College}/`, { timeout: 0, waitUntil: "domcontentloaded" });
	await new Promise((r) => setTimeout(r, 5000));

	const events = await page.evaluate(() => {
		const eventElements = document.querySelectorAll(
			'[data-testid="container-block---ruSKZrkro"]',
		);
		const eventsArray: { thumbnailLink: string | null; detailsLink: string | null; eventType: string; }[] = [];

		eventElements.forEach((elem) => {
			const thumbnailLink = elem.querySelector("img")?.src || null;
			const detailsLink =
				(elem.querySelector("a.link-styles__link_1ec3q") as HTMLAnchorElement)
					?.href || null;

			const eventTypeElement = elem.querySelector(
				"div[data-testid='container-block-VDLl86XLOx3'] span.plainText-styles__plainText_8ys50",
			);
			const eventType = eventTypeElement?.textContent?.trim() || "";

			eventsArray.push({
				thumbnailLink,
				detailsLink,
				eventType,
			});
		});

		return eventsArray;
	});

	await browser.close();

	const results: Events[] = [];
	for (const event of events) {
		let title: string | null = "";
		if (event.detailsLink) {
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
			} catch (e) {
				title = "";
			}
		}
		const fullTitle = event.eventType ? `${title} - ${event.eventType}` : title;
		results.push({
			title: fullTitle,
			thumbnailLink: event.thumbnailLink,
			detailsLink: event.detailsLink,
		});
	}

	return results;
};
