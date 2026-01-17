import { Elysia } from 'elysia';

const stringify = (o: object): string => JSON.stringify(o, null, 2);

/**
 * Safely extract error message from Elysia's error union type
 */
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Unknown error';
};

/**
 * Error handling middleware
 */
export const errorMiddleware = new Elysia({ name: 'error-handler' }).onError(
  ({ code, error, set }) => {
    console.error(stringify({ ERROR: error }));

    if (code === 'NOT_FOUND') {
      set.status = 404;
      return stringify({
        error: 'Not Found',
        status: 404,
      });
    }

    if (code === 'VALIDATION') {
      set.status = 400;
      return stringify({
        error: 'Validation Error',
        message: getErrorMessage(error),
        status: 400,
      });
    }

    set.status = 500;
    return stringify({
      error: 'Internal Server Error',
      message: getErrorMessage(error),
      status: 500,
    });
  },
);
