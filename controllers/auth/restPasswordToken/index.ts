import { NextFunction, Request, Response } from "express"
import validation from './validation';
import resetPasswordToken from "../../../services/auth/resetPasswordToken";
import AppError from "../../../utils/AppError";
const logPrefix = "[AUTH:RESETPASSWORDTOKEN:CONTROLLER]"
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(`${logPrefix} Init ===> `, JSON.stringify({ ...req.body }));
		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}

		// Send reset phone token to provided phone
		const { status, statusCode, message, data } = await resetPasswordToken({ phone: value.emailPhone });

		return res.status(statusCode).send({
			status,
			data,
			message
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}