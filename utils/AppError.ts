export default class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public logPrefix?: string;
  public errors?: any;

  constructor(message: string, statusCode: number, logPrefix?: string, errors?: any) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.logPrefix = logPrefix;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
