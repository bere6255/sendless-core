import { NextFunction, Request, Response } from "express"
import validation from "./validation"
import setPing from "../../../services/pin/setPing"
import AppError from "../../../utils/AppError";
const logPrefix = "[PIN:SETPIN:CONTROLLER]";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		console.log(`${logPrefix} init ===> user_id: `, user.id);

		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}
		const { pin } = value
		const { status, statusCode, data, message } = await setPing({ pin, user });
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