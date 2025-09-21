import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Fallbacks
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const logPrefix = err.logPrefix || "[GLOBAL:ERROR]";

  // Prevent leaking full message in production
  const isProduction = process.env.NODE_ENV === "production";
  const responseMessage =
    statusCode === 500 && isProduction ? "Something went wrong" : err.message;

  // Log full error details
  console.error(`${logPrefix} ${err.message}`, {
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: (req as any).user?.id || null,
  });

  return res.status(statusCode).json({
    status,
    message: responseMessage,
    errors: err.errors || [],
    data: {},
  });
}
