import User from "../../models/User"
import Token from '../../models/Token';
import phoneMessage from "../../helpers/messages/phoneMessage";
import Bans from "../../models/Bans";
import generateToken from "../../helpers/generateToken";
type sendForgotPassWord = {
	phone: string
}
const logPrefix = "[AUTH:RESETPASSWORDTOKEN:SERVICE]"

export default async ({ phone }: sendForgotPassWord) => {
	try {
		const user = await User.query().findOne({ phone });
		if (!user) {
			return {
				status: true,
				statusCode: 200,
				data: {},
				message: `A reset token have been sent to ${phone}`,
			};
		}
		
		if (user.banned_at) {
			return {
				status: true,
				statusCode: 400,
				data: {},
				message: "Please contact support ",
			};
		}
		const checkTokens = await Token.query().where({ identifier: user.phone, type: "password_reset" });
		if (checkTokens.length >= 5) {
			console.log(`${logPrefix} ban email ${user.phone}  ===> ban for exceeding reset password attempts`);
			const reason = "Ban for exceeding password reset attempts";
			await User.query()
				.patch({ banned_at: new Date() })
				.where("id", "=", user.id);
			await Bans.query().insert({
				user_id: user.id,
				ban_by: "system:password:reset",
				comment: reason,
				created_at: new Date,
				updated_at: new Date
			});

			await phoneMessage({ phone: user.phone, type: "ban", meta: { name: user.firstName, reason } });
			return { status: true, statusCode: 200, data: {}, message: `A reset token have been sent to ${user.phone}` }
		}

		let otp
		const generateTokenRes = await generateToken({ identifier: phone, type: "password_reset" });
		if (generateTokenRes.status) {
			otp = generateTokenRes.data.token;
		}

		await phoneMessage({ phone: user.phone, type: "resetPassword", meta: { name: user.firstName, token: otp } });

		return { status: true, statusCode: 200, data: {}, message: `A reset token have been sent to ${user.phone}` }
	} catch (error: any) {
		console.log("Send Forgot Password error ===>", error.message, error.stack);
		return { status: false, statusCode: 401, data: {}, message: "Failed to send reset password token, please try again in a few minutes " }
	}
}