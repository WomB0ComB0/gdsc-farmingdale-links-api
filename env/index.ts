import { cleanEnv, num, str } from "envalid";

/**
 * Environment variables required by the app.
 *
 * @see https://github.com/af/envalid
 */

export default cleanEnv(process.env, {
  PORT: num(),
  NODE_ENV: str({ choices: ["development", "production", "test"] }),
  PUBLIC_URL: str(),
});
