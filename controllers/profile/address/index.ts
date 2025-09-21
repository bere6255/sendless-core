import { NextFunction, Request, Response } from "express"
import validation from './validation';
import address from "../../../services/profile/address";
import AppError from "../../../utils/AppError";
const logPrefix = "[PROFILE:ADDRESS:CONTROLLER]";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(`${logPrefix} init ===> user phone `, req.user?.phone);
		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}

		const { status, statusCode, data, message } = await address({ ...value, user: req.user });

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