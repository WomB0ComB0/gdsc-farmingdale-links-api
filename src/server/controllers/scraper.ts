import axios from "axios";
import { load } from "cheerio";
import puppeteer from "puppeteer";
import { College } from "../constant/index";

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
		const eventsArray: Events[] = [];

		eventElements.forEach((elem) => {
			const titleElement = elem.querySelector(
				"div[data-testid='container-block-4p6-5nQVq'] a span.plainText-styles__plainText_8ys50",
			);
			const title = titleElement?.textContent?.trim() || "";

			const eventTypeElement = elem.querySelector(
				"div[data-testid='container-block-VDLl86XLOx3'] span.plainText-styles__plainText_8ys50",
			);
			const eventType = eventTypeElement?.textContent?.trim() || "";

			const fullTitle = eventType ? `${title} - ${eventType}` : title;

			const thumbnailLink = elem.querySelector("img")?.src || null;
			const detailsLink =
				(elem.querySelector("a.link-styles__link_1ec3q") as HTMLAnchorElement)
					?.href || null;

			eventsArray.push({
				title: fullTitle,
				thumbnailLink,
				detailsLink,
			});
		});

		return eventsArray;
	});
	browser.close();
	return events;
};
