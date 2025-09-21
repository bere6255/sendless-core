import { NextFunction, Request, Response } from "express"
import validation from './validation';
import sendRegisterPhoneEmailOtp from "../../../services/auth/sendRegisterPhoneEmailOtp";
import AppError from "../../../utils/AppError";
const logPrefix = "[AUTH:SENDPHONEEMAILTOKEN:CONTROLLER]";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}
		const { emailPhone, type, country, } = value

		console.log(`${logPrefix} init ===> `, emailPhone);

		const sendRegisterPhoneEmailOtpRes = await sendRegisterPhoneEmailOtp({ phoneEmail: emailPhone, type, metaData: { type: "register", country } });

		return res.status(sendRegisterPhoneEmailOtpRes.statusCode).send({
			status: sendRegisterPhoneEmailOtpRes.status,
			data: sendRegisterPhoneEmailOtpRes.data,
			message: sendRegisterPhoneEmailOtpRes.message
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}