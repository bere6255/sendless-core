import { NextFunction, Request, Response } from "express"
import validation from './validation';
import addPhone from "../../../services/profile/addPhone";
import AppError from "../../../utils/AppError";
const logPrefix = "[PROFILE:ADDPHONE:CONTROLLER]";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(`${logPrefix} init ===> user_email `, req.user?.email);
		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}

		const { status, statusCode, data, message } = await addPhone({ ...value, userId: req.user.id });

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