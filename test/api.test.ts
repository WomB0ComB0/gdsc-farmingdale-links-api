import express from "express";
import request from "supertest";
import { server } from "../src/server";

const app = express();
app.use(server);

describe("Fetch logged-in user", function () {
  test("as unauthenticated user", async function () {
    const res = await request(app)
      .get("/api")
      .accept("application/json")
  });
});
