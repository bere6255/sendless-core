import { NextFunction, Request, Response } from "express"
import validation from "./validation"
import updatePing from "../../../services/pin/updatePing";
import AppError from "../../../utils/AppError";
const logPrefix ="[PIN:UPDATEPIN:CONTROLLER]";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		console.log("update pin called ==> ", user.id);
		
		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}

		const { status, statusCode, data, message } = await updatePing({newPin: value.pin, token: value.token , user})
		
		return res.status(statusCode).send({
			status,
			data,
			message,
		});
	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);
	}
};
