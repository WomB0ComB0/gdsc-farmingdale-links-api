import { describe, test, expect } from "vitest"

describe("Fetch past events", async () => {
  test("Should receive past events", async () => {
    try {
      const events = await fetch('http://localhost:3000/api/past-events');
      const eventsJson = await events.json()
      console.log(eventsJson)
      eventsJson.forEach(event => {
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
      const events = await fetch(`http://localhost:3000/api/upcoming-events`);
      const eventsJson = await events.json()
      console.log(eventsJson)
      if (eventsJson && eventsJson.body) {
        events.body.forEach(event => {
          expect(event).toHaveProperty("title");
          expect(event).toHaveProperty("thumbnailLink");
          expect(event).toHaveProperty("detailsLink");
        });
      } else {
        console.error("Something occurred")
      }
      expect(events.status).toBe(200);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
