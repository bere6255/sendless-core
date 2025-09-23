import { NextFunction, Request, Response } from "express"
import validation from './validation';
import User from "../../../models/User";
import AppError from "../../../utils/AppError";
import redisConnection from "../../../redis/redisConnection";
const logPrefix = "[USER:CREATETAG:CONTROLLER]"
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(`${logPrefix} init ===> `, JSON.stringify(req.body));
		const user = req.user;
		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}
		const { tag } = value
		const checkTag = await User.query().findOne({ tag });
		if (checkTag) {
			throw new AppError(`Tag ${tag} have already been taken `, 400, logPrefix, errors);
		}


		await User.query().findOne({ id: user.id }).update({
			tag,
			updated_at: new Date
		});
		await redisConnection({ type: "delete", key: `users:${user.id}`, value: null, time: null });
		return res.status(200).send({
			status: "success",
			data: {},
			message: `Tag was created successfully`,
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}