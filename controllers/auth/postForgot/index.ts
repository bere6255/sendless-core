import { NextFunction, Request, Response } from "express"
import validation from './validation';
import ForgotPassword from "../../../services/auth/ForgotPassword";
import AppError from "../../../utils/AppError";
const logPrefix = "AUTH:POSTFORGOT:CONTROLLER";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(`${logPrefix} init ===> `);
		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}

		const { status, statusCode, data, message } = await ForgotPassword(value)

		return res.status(statusCode).send({
			status,
			data,
			message,
		});
	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}