import { NextFunction, Request, Response } from "express"
import validation from "./validation"
import register from "../../../services/auth/register";
import AppError from "../../../utils/AppError";
const logPrefix = "[AUTH:REGISTER:CONTROLLER]";
export default async (req: Request, res: Response, next: NextFunction) => {
	console.log(`${logPrefix} INIT ===> `, JSON.stringify({ ...req.body, token: null, password: null }));
	try {

		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}

		const { status, statusCode, data, message } = await register({ ...value });

		return res.status(statusCode).json({ status, data, message })
	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);
	}
}