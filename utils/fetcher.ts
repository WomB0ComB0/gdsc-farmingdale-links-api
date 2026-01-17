/**
 * Copyright 2026 GDG on Campus Farmingdale State College
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { HttpClient, HttpClientRequest, type HttpClientResponse } from '@effect/platform';
import { Duration, Effect, ParseResult, Schedule, Schema, pipe } from 'effect';

/**
 * Configuration options for the fetcher utility.
 */
export interface FetcherOptions<T = unknown> {
  /** Number of times to retry the request on failure */
  retries?: number;
  /** Delay in milliseconds between retries */
  retryDelay?: number;
  /** Optional callback invoked on error */
  onError?: (error: unknown) => void;
  /** Timeout in milliseconds for the request */
  timeout?: number;
  /** Additional headers to include in the request */
  headers?: Record<string, string>;
  /** Effect/Schema for runtime validation of the response */
  // biome-ignore lint/suspicious/noExplicitAny: Effect Schema invariance requires `any` for Encoded type
  schema?: Schema.Schema<T, any, never>;
  /** Abortsignal */
  signal?: AbortSignal;
  /** Body type - defaults to 'json', use 'text' for form-encoded data */
  bodyType?: 'json' | 'text';
}

/**
 * Represents all supported HTTP methods for the fetcher utility.
 */
export type HttpMethod = Schema.Schema.Type<typeof HttpMethod>;
/**
 * Represents a type-safe map of query parameters.
 * Each value can be a string, number, boolean, null, undefined, or an array of those types.
 */
export type QueryParams = Schema.Schema.Type<typeof QueryParams>;
/**
 * Represents a type-safe request body for HTTP methods that support a body.
 * Can be an object, array, string, number, boolean, or null.
 */
export type RequestBody = Schema.Schema.Type<typeof RequestBody>;
/**
 * Represents HTTP headers as key-value string pairs.
 */
export type Headers = Schema.Schema.Type<typeof Headers>;

const EMPTY = '';

const safeStringify = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

/**
 * Get the base URL for API requests.
 * - Client-side: returns empty string (uses relative URLs)
 * - Server-side: returns absolute URL
 */
const getBaseURL = (): string => {
  // Client-side: use relative URLs
  if (globalThis.window !== undefined) {
    return '';
  }

  // Explicit site URL (production)
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/+$/, '');
  }

  // Alternative base URL env var
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/+$/, '');
  }

  // Build from HOST and PORT
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || '3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  return `${protocol}://${host}:${port}`;
};

/**
 * @module effect-fetcher
 *
 * Type-safe, Effect-based HTTP data fetching utilities with Effect Schema runtime validation.
 *
 * This module provides a generic, type-safe fetcher utility and convenience functions for all HTTP verbs.
 * It supports retries, timeouts, custom headers, error handling, runtime validation with Effect Schema,
 * and integrates with Effect for composable async flows.
 *
 * ## Features
 * - Type-safe HTTP requests for all verbs (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD)
 * - Runtime type validation with effect/Schema
 * - Effect-based error handling and retry logic
 * - Customizable headers, timeouts, and retry strategies
 * - Rich error context via FetcherError and ValidationError
 * - Query parameter serialization
 * - Designed for use with Effect and React Query
 *
 * @see FetcherError
 * @see ValidationError
 * @see fetcher
 * @see get
 * @see post
 * @see put
 * @see patch
 * @see del
 * @see options
 * @see head
 *
 * @example
 * ```ts
 * import { get } from './effect-fetcher.js';
 * import { Effect, Schema } from 'effect';
 *
 * const UserSchema = Schema.Struct({
 *   id: Schema.Number,
 *   name: Schema.String,
 *   email: Schema.String
 * });
 *
 * const UsersSchema = Schema.Struct({
 *   users: Schema.Array(UserSchema)
 * });
 *
 * const effect = get('/api/users', {
 *   retries: 2,
 *   schema: UsersSchema
 * });
 * const result = await Effect.runPromise(effect);
 * console.log(result.users); // Fully typed and validated!
 * ```
 */

// HTTP Method type definition
const HttpMethod = Schema.Literal('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD');
// Query parameters type definition
const QueryParams = Schema.Record({
  key: Schema.String,
  value: Schema.Union(
    Schema.String,
    Schema.Number,
    Schema.Boolean,
    Schema.Undefined,
    Schema.Null,
    Schema.Array(Schema.Union(Schema.String, Schema.Number, Schema.Boolean)),
  ),
});
// Request body type definition
const RequestBody = Schema.Union(
  Schema.Record({ key: Schema.String, value: Schema.Unknown }),
  Schema.Array(Schema.Unknown),
  Schema.String,
  Schema.Number,
  Schema.Boolean,
  Schema.Null,
);
// Headers type definition
const Headers = Schema.Record({ key: Schema.String, value: Schema.String });

/**
 * Custom error class for validation-specific errors.
 * Includes detailed validation problems from effect/Schema.
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly url: string,
    public readonly problems: string,
    public readonly responseData: unknown,
    public readonly attempt?: number,
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  [Symbol.toStringTag] = 'ValidationError';

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return this.toString();
  }

  [Symbol.for('Deno.customInspect')]() {
    return this.toString();
  }

  [Symbol.for('react.element')]() {
    return this.toString();
  }

  toString(): string {
    const attemptStr = this.attempt ? `, Attempt: ${this.attempt}` : '';
    return `ValidationError: ${this.message} (URL: ${this.url}${attemptStr})`;
  }

  /**
   * Get a formatted string of all validation problems
   */
  getProblemsString(): string {
    return this.problems;
  }
}

/**
 * Custom error class for fetcher-specific errors.
 * Includes additional context such as the request URL, HTTP status, response data, and attempt number.
 */
export class FetcherError extends Error {
  constructor(
    message: string,
    public readonly url: string,
    public readonly status?: number,
    public readonly responseData?: unknown,
    public readonly attempt?: number,
  ) {
    super(message);
    this.name = 'FetcherError';
    Object.setPrototypeOf(this, FetcherError.prototype);
  }

  [Symbol.toStringTag] = 'FetcherError';

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return this.toString();
  }

  [Symbol.for('Deno.customInspect')]() {
    return this.toString();
  }

  [Symbol.for('react.element')]() {
    return this.toString();
  }

  toString(): string {
    const statusStr = this.status ? `, Status: ${this.status}` : '';
    const attemptStr = this.attempt ? `, Attempt: ${this.attempt}` : '';
    return `FetcherError: ${this.message} (URL: ${this.url}${statusStr}${attemptStr})`;
  }
}

/**
 * Builds a query string from the provided query parameters.
 */
const buildQueryString = (params?: QueryParams): string => {
  if (!params) return EMPTY;
  const urlParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item != null) {
          urlParams.append(key, String(item));
        }
      }
    } else {
      urlParams.append(key, String(value));
    }
  }

  return urlParams.toString();
};

/**
 * Builds a type-safe HttpClientRequest for the given method and URL.
 */
const buildRequest = (method: HttpMethod, url: string): HttpClientRequest.HttpClientRequest => {
  switch (method) {
    case 'GET':
      return HttpClientRequest.get(url);
    case 'POST':
      return HttpClientRequest.post(url);
    case 'PUT':
      return HttpClientRequest.put(url);
    case 'PATCH':
      return HttpClientRequest.patch(url);
    case 'DELETE':
      return HttpClientRequest.del(url);
    case 'OPTIONS':
      return HttpClientRequest.options(url);
    case 'HEAD':
      return HttpClientRequest.head(url);
  }
};

/**
 * Validates response data using the provided Effect schema.
 */
const validateResponse = <T>(
  data: unknown,
  attempt: number,
  url: string,
  // biome-ignore lint/suspicious/noExplicitAny: Effect Schema invariance requires `any` for Encoded type
  schema?: Schema.Schema<T, any, never>,
  onError?: (error: unknown) => void,
): Effect.Effect<T, ValidationError, never> => {
  if (!schema) {
    return Effect.succeed(data as T);
  }

  const result = Schema.decodeUnknownEither(schema)(data);

  if (result._tag === 'Left') {
    const problems = ParseResult.TreeFormatter.formatIssueSync(result.left.issue);
    const validationError = new ValidationError(
      'Response validation failed',
      url,
      problems,
      data,
      attempt,
    );

    if (onError) onError(validationError);
    return Effect.fail(validationError);
  }

  return Effect.succeed(result.right);
};

/**
 * Wraps an Effect with a timeout, converting timeout errors to FetcherError.
 */
const withTimeout = <A, E, R>(
  eff: Effect.Effect<A, E, R>,
  timeout: number,
  url: string,
  attempt: number,
): Effect.Effect<A, FetcherError | E, R> =>
  pipe(
    eff,
    Effect.timeoutFail({
      duration: Duration.millis(timeout),
      onTimeout: () => new FetcherError('Request timed out', url, undefined, undefined, attempt),
    }),
  );

/**
 * Creates a retry schedule with exponential backoff and error filtering.
 */
const createRetrySchedule = (retries: number, retryDelay: number) =>
  pipe(
    Schedule.exponential(Duration.millis(retryDelay)),
    Schedule.intersect(Schedule.recurs(retries)),
    Schedule.whileInput((error: FetcherError | ValidationError) => {
      // Don't retry validation errors or client errors (except 429)
      if (error instanceof ValidationError) return false;
      if (error instanceof FetcherError && error.status) {
        if (error.status === 429) return true; // Always retry 429 rate limits
        if (error.status >= 400 && error.status < 500) return false; // Don't retry other 4xx
      }
      return true;
    }),
  );

/**
 * Parses the response, handling HTTP errors and JSON parsing.
 */
const parseResponse = (
  response: HttpClientResponse.HttpClientResponse,
  url: string,
  attempt: number,
): Effect.Effect<unknown, FetcherError, never> => {
  // Check for HTTP errors (non-2xx status codes)
  if (response.status < 200 || response.status >= 300) {
    return Effect.gen(function* () {
      const errorData = yield* pipe(
        response.json,
        Effect.catchAll(() => Effect.succeed(undefined)),
      );

      const errorText = yield* pipe(
        response.text,
        Effect.catchAll(() => Effect.succeed('Request failed')),
      );

      // Enhanced error handling for 429 Rate Limit responses
      const errorMessage =
        response.status === 429
          ? `Rate limit exceeded (429). Please slow down requests to ${url}`
          : `HTTP ${response.status}: ${errorText}`;

      return yield* Effect.fail(
        new FetcherError(errorMessage, url, response.status, errorData, attempt),
      );
    });
  }

  // Parse response data as JSON, with fallback to text and detailed error reporting
  return pipe(
    response.json,
    Effect.catchAll((error) => {
      // Try to get response text for better debugging
      return pipe(
        response.text,
        Effect.flatMap((text) => {
          const errorMessage = `Failed to parse JSON response. Status: ${response.status}, Content-Type: ${response.headers['Content-Type'] || 'unknown'}, Body: ${text.slice(0, 200)}${text.length > 200 ? '...' : ''}`;
          return Effect.fail(
            new FetcherError(
              errorMessage,
              url,
              response.status,
              { originalError: error, responseText: text },
              attempt,
            ),
          );
        }),
        Effect.catchAll(() =>
          Effect.fail(
            new FetcherError(
              `Failed to parse response: ${error instanceof Error ? error.message : String(error)}`,
              url,
              response.status,
              undefined,
              attempt,
            ),
          ),
        ),
      );
    }),
  );
};

// --- Overloaded function signatures for type safety with effect/Schema ---

/**
 * Performs a GET request with optional schema validation.
 */
export function fetcher<T = unknown>(
  input: string,
  method?: 'GET',
  options?: FetcherOptions<T>,
  params?: QueryParams,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient>;

/**
 * Performs a GET request with Effect schema validation and automatic type inference.
 */
export function fetcher<S extends Schema.Schema<Schema.Any, Schema.Any, never>>(
  input: string,
  method: 'GET',
  options: FetcherOptions<Schema.Schema.Type<S>> & { schema: S },
  params?: QueryParams,
): Effect.Effect<Schema.Schema.Type<S>, FetcherError | ValidationError, HttpClient.HttpClient>;

/**
 * Performs a POST, PUT, or PATCH request with a request body and optional schema validation.
 */
export function fetcher<T = unknown>(
  input: string,
  method: 'POST' | 'PUT' | 'PATCH',
  options?: FetcherOptions<T>,
  params?: QueryParams,
  body?: RequestBody,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient>;

/**
 * Performs a POST, PUT, or PATCH request with Effect schema validation and automatic type inference.
 */
export function fetcher<S extends Schema.Schema<Schema.Any, Schema.Any, never>>(
  input: string,
  method: 'POST' | 'PUT' | 'PATCH',
  options: FetcherOptions<Schema.Schema.Type<S>> & { schema: S },
  params?: QueryParams,
  body?: RequestBody,
): Effect.Effect<Schema.Schema.Type<S>, FetcherError | ValidationError, HttpClient.HttpClient>;

/**
 * Performs a DELETE, OPTIONS, or HEAD request with optional schema validation.
 */
export function fetcher<T = unknown>(
  input: string,
  method: 'DELETE' | 'OPTIONS' | 'HEAD',
  options?: FetcherOptions<T>,
  params?: QueryParams,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient>;

/**
 * Enhanced data fetching utility with type safety, Effect Schema validation, and Effect-based error handling.
 * Supports retries, timeouts, custom headers, runtime validation, and error handling.
 *
 * @template T
 * @param input The URL to request
 * @param method The HTTP method to use
 * @param options Optional fetcher configuration including Effect Schema
 * @param params Optional query parameters
 * @param body Optional request body (for methods that support it)
 * @returns An Effect that resolves to the validated response data of type T
 *
 * @example
 * ```ts
 * import { Schema } from 'effect';
 *
 * const UserSchema = Schema.Struct({
 *   id: Schema.Number,
 *   name: Schema.String,
 *   email: Schema.String
 * });
 *
 * const effect = pipe(
 *   get("/api/user/123", {
 *     retries: 1,
 *     retryDelay: 1_000,
 *     timeout: 10_000,
 *     schema: UserSchema,
 *     onError: (error) => {
 *       if (error instanceof ValidationError) {
 *         console.error("Validation failed:", error.getProblemsString())
 *       }
 *     }
 *   }),
 *   Effect.provide(HttpClient.layer)
 * )
 * ```
 */
export function fetcher<T = unknown>(
  input: string,
  method: HttpMethod = 'GET',
  options: FetcherOptions<T> = {},
  params?: QueryParams,
  body?: RequestBody,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient> {
  const {
    retries = 0,
    retryDelay = 1_000,
    onError,
    timeout = 10_000,
    headers = {},
    schema,
    bodyType = 'json',
  } = options;

  const queryString = buildQueryString(params);

  // Build URL based on environment:
  // - Client-side: keep relative URLs for same-origin requests
  // - Server-side: convert to absolute URLs for SSR
  // - External URLs: keep as-is
  let url: string;
  if (input.startsWith('http')) {
    // Already absolute (external API)
    url = queryString ? `${input}?${queryString}` : input;
  } else {
    // Relative URL - prepend base URL for SSR, keep relative for client
    const baseURL = getBaseURL();
    const fullPath = baseURL ? `${baseURL}${input}` : input;
    url = queryString ? `${fullPath}?${queryString}` : fullPath;
  }

  return Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    let attempt = 0;

    // Build the request object
    let req = buildRequest(method, url);

    // Add body for methods that support it with proper error handling
    if (body != null && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      if (bodyType === 'text') {
        // bodyText returns HttpClientRequest directly
        const textBody =
          typeof body === 'object' && body !== null ? JSON.stringify(body) : String(body);
        req = HttpClientRequest.bodyText(textBody)(req);
      } else {
        // bodyJson returns an Effect that may fail during serialization
        req = yield* pipe(
          HttpClientRequest.bodyJson(body)(req),
          Effect.mapError(
            (error) =>
              new FetcherError(
                `Failed to serialize request body: ${safeStringify(error)}`,
                url,
                undefined,
                undefined,
                attempt,
              ),
          ),
        );
      }
    }

    // Set headers AFTER body to ensure Content-Type can be overridden
    req = HttpClientRequest.setHeaders(headers)(req);

    // Enhanced retry schedule:
    // - Exponential backoff starting from retryDelay
    // - Maximum number of retries
    // - Special handling for 429 rate limit errors
    const retrySchedule = createRetrySchedule(retries, retryDelay);

    /**
     * Executes the HTTP request, handling errors, HTTP status, response parsing, and validation.
     */
    const executeRequest = Effect.gen(function* () {
      attempt++;

      // Execute the HTTP request and handle network/transport errors
      const response = yield* pipe(
        client.execute(req),
        (eff) => withTimeout(eff, timeout, url, attempt),
        Effect.mapError((error) => {
          if (error instanceof FetcherError) return error;

          return new FetcherError(
            error instanceof Error ? error.message : String(error),
            url,
            undefined,
            undefined,
            attempt,
          );
        }),
      );

      // Parse and check response
      const rawData = yield* parseResponse(response, url, attempt);

      // Validate the response data using Effect Schema if provided
      const validatedData = yield* validateResponse(rawData, attempt, url, schema, onError);

      return validatedData;
    });

    // Run the request with retry and error handling
    return yield* pipe(
      executeRequest,
      Effect.retry(retrySchedule),
      Effect.catchAll((error) => {
        if (error instanceof FetcherError || error instanceof ValidationError) {
          if (onError) onError(error);
          return Effect.fail(error);
        }

        const fetcherError = new FetcherError(String(error), url, undefined, undefined, attempt);

        if (onError) onError(fetcherError);
        return Effect.fail(fetcherError);
      }),
    );
  });
}

/**
 * Convenience function for GET requests with optional schema validation.
 *
 * @example
 * ```ts
 * import { Schema } from 'effect';
 *
 * const UserSchema = Schema.Struct({
 *   id: Schema.Number,
 *   name: Schema.String,
 *   email: Schema.String
 * });
 *
 * const effect = get("/api/user", { schema: UserSchema });
 * const user = await Effect.runPromise(effect); // Fully typed and validated!
 * ```
 */
export function get<T = unknown>(
  url: string,
  options?: FetcherOptions<T>,
  params?: QueryParams,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient>;

export function get<A, I, R extends never>(
  url: string,
  options: FetcherOptions<A> & { schema: Schema.Schema<A, I, R> },
  params?: QueryParams,
): Effect.Effect<A, FetcherError | ValidationError, HttpClient.HttpClient>;

export function get<T = unknown>(url: string, options?: FetcherOptions<T>, params?: QueryParams) {
  return fetcher<T>(url, 'GET', options, params);
}

/**
 * Convenience function for POST requests with optional schema validation.
 */
export function post<T = unknown>(
  url: string,
  body?: RequestBody,
  options?: FetcherOptions<T>,
  params?: QueryParams,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient>;

export function post<S extends Schema.Schema<Schema.Any, Schema.Any, never>>(
  url: string,
  body: RequestBody,
  options: FetcherOptions<Schema.Schema.Type<S>> & { schema: S },
  params?: QueryParams,
): Effect.Effect<Schema.Schema.Type<S>, FetcherError | ValidationError, HttpClient.HttpClient>;

export function post<T = unknown>(
  url: string,
  body?: RequestBody,
  options?: FetcherOptions<T>,
  params?: QueryParams,
) {
  return fetcher<T>(url, 'POST', options, params, body);
}

/**
 * Convenience function for PUT requests with optional schema validation.
 */
export function put<T = unknown>(
  url: string,
  body?: RequestBody,
  options?: FetcherOptions<T>,
  params?: QueryParams,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient>;

export function put<S extends Schema.Schema<Schema.Any, Schema.Any, never>>(
  url: string,
  body: RequestBody,
  options: FetcherOptions<Schema.Schema.Type<S>> & { schema: S },
  params?: QueryParams,
): Effect.Effect<Schema.Schema.Type<S>, FetcherError | ValidationError, HttpClient.HttpClient>;

export function put<T = unknown>(
  url: string,
  body?: RequestBody,
  options?: FetcherOptions<T>,
  params?: QueryParams,
) {
  return fetcher<T>(url, 'PUT', options, params, body);
}

/**
 * Convenience function for PATCH requests with optional schema validation.
 */
export function patch<T = unknown>(
  url: string,
  body?: RequestBody,
  options?: FetcherOptions<T>,
  params?: QueryParams,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient>;

export function patch<S extends Schema.Schema<Schema.Any, Schema.Any, never>>(
  url: string,
  body: RequestBody,
  options: FetcherOptions<Schema.Schema.Type<S>> & { schema: S },
  params?: QueryParams,
): Effect.Effect<Schema.Schema.Type<S>, FetcherError | ValidationError, HttpClient.HttpClient>;

export function patch<T = unknown>(
  url: string,
  body?: RequestBody,
  options?: FetcherOptions<T>,
  params?: QueryParams,
) {
  return fetcher<T>(url, 'PATCH', options, params, body);
}

/**
 * Convenience function for DELETE requests with optional schema validation.
 */
export function del<T = unknown>(
  url: string,
  options?: FetcherOptions<T>,
  params?: QueryParams,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient>;

export function del<S extends Schema.Schema<Schema.Any, Schema.Any, never>>(
  url: string,
  options: FetcherOptions<Schema.Schema.Type<S>> & { schema: S },
  params?: QueryParams,
): Effect.Effect<Schema.Schema.Type<S>, FetcherError | ValidationError, HttpClient.HttpClient>;

export function del<T = unknown>(url: string, options?: FetcherOptions<T>, params?: QueryParams) {
  return fetcher<T>(url, 'DELETE', options, params);
}

/**
 * Convenience function for OPTIONS requests with optional schema validation.
 */
export function options<T = unknown>(
  url: string,
  options?: FetcherOptions<T>,
  params?: QueryParams,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient>;

export function options<S extends Schema.Schema<Schema.Any, Schema.Any, never>>(
  url: string,
  options: FetcherOptions<Schema.Schema.Type<S>> & { schema: S },
  params?: QueryParams,
): Effect.Effect<Schema.Schema.Type<S>, FetcherError | ValidationError, HttpClient.HttpClient>;

export function options<T = unknown>(
  url: string,
  options?: FetcherOptions<T>,
  params?: QueryParams,
) {
  return fetcher<T>(url, 'OPTIONS', options, params);
}

/**
 * Convenience function for HEAD requests with optional schema validation.
 */
export function head<T = unknown>(
  url: string,
  options?: FetcherOptions<T>,
  params?: QueryParams,
): Effect.Effect<T, FetcherError | ValidationError, HttpClient.HttpClient>;

export function head<S extends Schema.Schema<Schema.Any, Schema.Any, never>>(
  url: string,
  options: FetcherOptions<Schema.Schema.Type<S>> & { schema: S },
  params?: QueryParams,
): Effect.Effect<Schema.Schema.Type<S>, FetcherError | ValidationError, HttpClient.HttpClient>;

export function head<T = unknown>(url: string, options?: FetcherOptions<T>, params?: QueryParams) {
  return fetcher<T>(url, 'HEAD', options, params);
}

// --- Utility functions for common schema patterns ---

/**
 * Helper function to create a paginated response schema.
 *
 * @example
 * ```ts
 * const UserSchema = Schema.Struct({
 *   id: Schema.Number,
 *   name: Schema.String
 * });
 *
 * const PaginatedUsersSchema = createPaginatedSchema(UserSchema);
 *
 * const effect = get("/api/users", {
 *   schema: PaginatedUsersSchema
 * });
 * ```
 */
export const createPaginatedSchema = <T, I>(itemSchema: Schema.Schema<T, I, never>) => {
  return Schema.Struct({
    data: Schema.Array(itemSchema),
    pagination: Schema.Struct({
      page: Schema.Number,
      pageSize: Schema.Number,
      total: Schema.Number,
      totalPages: Schema.Number,
    }),
  });
};

/**
 * Helper function to create an API response wrapper schema.
 *
 * @example
 * ```ts
 * const UserSchema = Schema.Struct({
 *   id: Schema.Number,
 *   name: Schema.String
 * });
 *
 * const WrappedUserSchema = createApiResponseSchema(UserSchema);
 *
 * const effect = get("/api/user/123", {
 *   schema: WrappedUserSchema
 * });
 * ```
 */
export const createApiResponseSchema = <T, I>(dataSchema: Schema.Schema<T, I, never>) => {
  return Schema.Struct({
    success: Schema.Boolean,
    data: dataSchema,
    message: Schema.optional(Schema.String),
    errors: Schema.optional(Schema.Array(Schema.String)),
  });
};
