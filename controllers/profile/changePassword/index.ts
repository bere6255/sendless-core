import { NextFunction, Request, Response } from "express"
import validation from './validation';
import changePassword from "../../../services/profile/changePassword";
import AppError from "../../../utils/AppError";
const logPrefix = "[PROFILE:CHANGEPASSWORD:CONTROLLER]";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		console.log(`${logPrefix} init ===> user_email: ${user.email}`);
		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}

		const { status, statusCode, data, message } = await changePassword({ ...value, user });

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