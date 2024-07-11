/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, test, afterAll } from "vitest";
import request from "supertest";
import { server } from "./server";

describe("Fetch past events", () => {
  afterAll(() => {
    server.close();
  });
  test("Server should be running", () => {
    expect(server.listening).toBe(true);
  });
	test("Should receive past events", async () => {
		try {
			const events = await request(server).get("/api/past-events");
			expect(events.status).toBe(200);
			const eventsJson = await events.body;
			console.log(eventsJson);
			eventsJson.forEach((event: any) => {
				expect(event).toHaveProperty("title");
				expect(event).toHaveProperty("thumbnailLink");
				expect(event).toHaveProperty("detailsLink");
			});
			expect(events.status).toBe(200);
		} catch (error) {
			console.error(error);
			throw error;
		}
	});
});

describe("Fetch upcoming events", async () => {
	test("Should receive upcoming events", async () => {
		try {
			const events = await request(server).get("/api/upcoming-events");
			const eventsJson = await events.body;
			console.log(eventsJson);
			eventsJson.forEach((event: any) => {
				expect(event).toHaveProperty("title");
				expect(event).toHaveProperty("thumbnailLink");
				expect(event).toHaveProperty("detailsLink");
			});
			expect(events.status).toBe(200);
		} catch (error) {
			console.error(error);
			throw error;
		}
	});
});
