import { Request, Response, NextFunction } from "express";
import validation from "./validation";
import login from "../../../services/auth/login";
import AppError from "../../../utils/AppError";

const logPrefix = "[AUTH:LOGIN:CONTROLLER]";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(
      `${logPrefix} init ===> `,
      JSON.stringify({ ...req.body, password: null, reCapToken: null })
    );

    const { errors, value } = await validation(req.body);

    if (errors) {
      throw new AppError(errors[0], 400, logPrefix, errors);
    }

    const result = await login({
      ...value,
      userAgent: req.headers["user-agent"],
      logPrefix, // pass it down to the service
    });

    return res.status(result.statusCode).send({
      status: result.status,
      data: result.data,
      message: result.message,
    });
  } catch (error: any) {
    error.logPrefix = logPrefix;
    next(error);
  }
};
