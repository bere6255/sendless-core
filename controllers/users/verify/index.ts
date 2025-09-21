import { NextFunction, Request, Response } from "express"
import User from "../../../models/User";
import Token from "../../../models/Token";
import validation from "./validation";
import AppError from "../../../utils/AppError";
const logPrefix = "[USER:VERIFY:CONTROLLER]";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log("Verify phone or email call ===> ", req.user.id);
		const user = req.user;
		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}
		const { token } = value

		const checkToken = await Token.query().findOne({ token });
		if (!checkToken) {

			throw new AppError('invalid verification token', 400, logPrefix, {});
		}
		const getUser = await User.query().findOne({ email: checkToken.identifier }).orWhere({ phone: checkToken.identifier });

		if (!getUser) {
			throw new AppError('invalid verification token', 400, logPrefix, {});
		}

		if (getUser.id !== user.id) {
			throw new AppError('invalid verification token', 400, logPrefix, {});
		}

		if (checkToken.type === 'email') {
			await User.query().findOne({ email: checkToken.identifier }).update({
				email_verified_at: new Date(),
				updated_at: new Date()
			})
		} else {
			await User.query().findOne({ email: checkToken.identifier }).update({
				phone_verified_at: new Date(),
				updated_at: new Date()
			})
		}
		await Token.query().deleteById(checkToken.id);

		console.log(`${checkToken.type} verification for ${checkToken.identifier}`);
		return res.status(200).send({
			status: "success",
			data: {},
			message: `${checkToken.type} verification was successful`,
		});

	} catch (error: any) {
		console.log("Verify Account Error ======>", error.message, error.stack);
		error.logPrefix = logPrefix;
		next(error);

	}
}