import { NextFunction, Request, Response } from "express"
import User from "../../../models/User";
import phoneMessage from "../../../helpers/messages/phoneMessage";
import Bans from "../../../models/Bans";
import Pin from "../../../models/Pin";
import AppError from "../../../utils/AppError";
import generateToken from "../../../helpers/generateToken";

const logPrefix = "PIN:SENDPINOTP:CONTROLLER";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user
		console.log(`${logPrefix} init user ${user.phone} ===> `);

		if (!user.phone) {
			throw new AppError("Please add your mobile phone to continue this process", 400, logPrefix, {});
		}
		const checkPin = await Pin.query().findOne({ user_id: user.id });
		if (!checkPin) {
			throw new AppError("Please creae your transaction pin to continue this process", 400, logPrefix, {});
		}


		let attempt = parseInt(checkPin.reset_attempts + 1) || 0;


		await Pin.query().findOne({ user_id: user.id }).update({
			reset_attempts: attempt,
			updated_at: new Date
		})

		if (attempt >= 5) {
			console.log(`${logPrefix} ban user ${user.email}  ===> ban for exceeding pin reset otp attempts`);
			await User.query()
				.patch({ banned_at: new Date() })
				.where("id", "=", user.id);
			await Bans.query().insert({
				user_id: user.id,
				ban_by: "system:pin:otp",
				comment: "Ban for exceeding pin reset otp attempts",
				created_at: new Date,
				updated_at: new Date
			});
			throw new AppError("Ban for exceeding pin reset otp attempts, please contact support.", 400, logPrefix, {});
		}


		let otp
		const generateTokenRes = await generateToken({ identifier: user.phone, type: "pin" });
		if (generateTokenRes.status) {
			otp = generateTokenRes.data.token;
		}

		// Send phone token to provided phone
		await phoneMessage({ phone: user.phone, type: "pin", meta: { token: otp } });
		// .substr(-5)
		return res.status(200).send({
			status: "success",
			data: {},
			message: `A token have been sent to ****${user.phone.slice(user.phone.length - 4)}`,
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}