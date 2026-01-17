import { afterAll, describe, expect, test } from 'bun:test';
import { app } from './app';

describe('GDSC Farmingdale API', () => {
  afterAll(async () => {
    // Elysia cleanup is handled automatically
  });

  describe('Health check', () => {
    test('GET /api/v1/health should return ok', async () => {
      const response = await app.handle(new Request('http://localhost/api/v1/health'));
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toHaveProperty('message', 'ok');
    });
  });

  describe('Events endpoints', () => {
    test('GET /api/v1/events/past should return array', async () => {
      const response = await app.handle(new Request('http://localhost/api/v1/events/past'));
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(Array.isArray(json)).toBe(true);
    });

    test('GET /api/v1/events/upcoming should return array', async () => {
      const response = await app.handle(new Request('http://localhost/api/v1/events/upcoming'));
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(Array.isArray(json)).toBe(true);
    });
  });

  describe('Utility endpoints', () => {
    test('GET /api/v1/ should return welcome message', async () => {
      const response = await app.handle(new Request('http://localhost/api/v1/'));
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toHaveProperty('message');
    });

    test('GET /api/v1/status should return status info', async () => {
      const response = await app.handle(new Request('http://localhost/api/v1/status'));
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toHaveProperty('data');
      expect(json.data).toHaveProperty('uptime');
      expect(json.data).toHaveProperty('memory');
    });

    test('GET /api/v1/version should return version', async () => {
      const response = await app.handle(new Request('http://localhost/api/v1/version'));
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toHaveProperty('version');
    });
  });
});
