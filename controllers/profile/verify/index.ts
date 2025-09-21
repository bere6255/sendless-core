import { NextFunction, Request, Response } from "express"
import validation from "./validation";
import verify from "../../../services/profile/verify";
import AppError from "../../../utils/AppError";
const logPrefix = "PROFILE:VERIFY:CONTROLLER";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		console.log(`${logPrefix} init ===> user id: ${user.id} `);

		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}

		const bvnRes = await verify({token: value.token, user});

		return res.status(bvnRes.statusCode).send({
			status: bvnRes.status,
			data: bvnRes.data,
			message: bvnRes.message,
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}