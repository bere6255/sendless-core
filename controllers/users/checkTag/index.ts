import { NextFunction, Request, Response } from "express"
import validation from './validation';
import User from "../../../models/User";
import AppError from "../../../utils/AppError";
const logPrefix = "[USER:CREATETAG:CONTROLLER]"
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(`${logPrefix} init ===> `, JSON.stringify(req.body));
		const user = req.user;
		const { errors, value } = await validation(req.params);


		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}
		const { tag } = value
		const checkTag = await User.query().findOne({ tag });
		if (!checkTag) {
			throw new AppError( `Tag ${tag} not found `, 400, logPrefix, {});
		
		}

		return res.status(200).send({
			status: "success",
			data: { user: checkTag.userSimplified() },
			message: `Tag was fetch successfully`,
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}