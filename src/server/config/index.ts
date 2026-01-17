/**
 * Server configuration constants
 */

/** College identifier for GDG community */
export const COLLEGE = 'gdg-on-campus-farmingdale-state-college-farmingdale-united-states';

/** Server port */
export const PORT = Number(process.env.PORT) || 8080;

/** Allowed CORS origins */
export const CORS_ORIGINS = [
  'https://gdsc-fsc-l.web.app',
  'https://gdg-fsc.web.app',
  'http://localhost:3000',
];

/** Rate limit configuration */
export const RATE_LIMIT = {
  duration: 60_000,
  max: 100,
} as const;

/** API version */
export const API_VERSION = await import('../../../package.json', { assert: { type: 'json' } })
  .then((pkg) => pkg.default.version)
  .catch(() => '1.0.0');

/** Scrape interval in milliseconds (24 hours) */
export const SCRAPE_INTERVAL_MS = 24 * 60 * 60 * 1000;
