import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";

export const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (err instanceof CustomError) {
		const { statusCode, errors, logging } = err;
		if (logging) {
			console.error(
				JSON.stringify(
					{
						code: err.statusCode,
						errors: err.errors,
						stack: err.stack,
					},
					null,
					2,
				),
			);
		}

		return res.status(statusCode).json({ errors });
	}

	console.error(JSON.stringify(err, null, 2));
	return res
		.status(500)
		.json({ errors: [{ message: "Something went wrong" }] });
};
