import { NextFunction, Request, Response } from "express"
import validation from "./validation";
import User from "../../../models/User";
import AppError from "../../../utils/AppError";
const logPrefix = "[P2P:NAMEENQUIRY:CONTROLLER]";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		console.log(`${logPrefix} init user: ${user.phone} ===>`, JSON.stringify(req.body));

		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}
		const checkUserDetaild = await User.query().findOne({ email: value.phoneTagEmail }).orWhere({ phone: value.phoneTagEmail }).orWhere({ tag: value.phoneTagEmail });

		if (!checkUserDetaild) {
			throw new AppError("Account not fount", 400, logPrefix, {});
		}


		return res.status(200).send({
			status: "success",
			data: {
				user: checkUserDetaild.userSimplified(),
			},
			message: "User details loaded successfully",
		});
	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);
	}
};
