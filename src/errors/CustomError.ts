export type CustomErrorContent = {
	message: string;
	context?: {
		[
			key: string
		]// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		: any;
	};
};

export abstract class CustomError extends Error {
	abstract readonly statusCode: number;
	abstract readonly errors: CustomErrorContent[];
	abstract readonly logging: boolean;

	constructor(
		message: string
	) {
		super(
			message
		);

		// Only because we are extending a built in class
		Object.setPrototypeOf(
			this,
			CustomError.prototype
		);
	}
}
