export class HTTPError extends Error {
	statusCode: number;
	context?: string;

	constructor(statusCode: number, message: string, context?: string) {
		super(message);
		this.context = context;
		this.statusCode = statusCode;
		this.message = message;
	}
}