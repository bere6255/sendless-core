import User from "../../models/User"
import Token from '../../models/Token';
import bcrypt from "bcryptjs"
import emailMessage from "../../helpers/messages/emailMessage";
import moment from "moment";
import Bans from "../../models/Bans";
type forgotPassWord = {
	password: string;
	token: string
}

const logPrefix = "AUTH:FORGOTPASSWORD:SERVICE";
const saltRounds = process.env.SALT_ROUNDS || '10';

export default async ({ password, token }: forgotPassWord) => {
	try {

		const checkToken = await Token.query().findOne({ token, type: "password_reset" });
		if (!checkToken) {
			return {
				status: true,
				statusCode: 200,
				data: {},
				message: "Password reset successfully ",
			};
		}

		const user = await User.query().findOne({ phone: checkToken.identifier });

		if (!user) {
			return {
				status: true,
				statusCode: 200,
				data: {},
				message: "Password reset successfully ",
			};
		}
		console.log(`${logPrefix} init for  phone ${user.phone}`);
		if (user.banned_at) {
			return {
				status: true,
				statusCode: 400,
				data: {},
				message: "Please contact support ",
			};
		}

		const timeDiference = moment(new Date()).diff(moment(checkToken.created_at), 'minutes');
		const attempt = user.reset_password_attempts ? user.reset_password_attempts : 0;

		if (timeDiference >= 10) {
			await Token.query().where({ token }).delete();

			if (attempt >= 5) {
				console.log(`${logPrefix} ban user ${user.phone}  ===> ban for exceeding reset password attempts`);
				const reason = "Ban for exceeding password reset attempts";
				await User.query()
					.update({ banned_at: new Date() })
					.where("id", "=", user.id);
				await Bans.query().insert({
					user_id: user.id,
					ban_by: "system:password:reset",
					comment: reason,
					created_at: new Date,
					updated_at: new Date
				});
				await emailMessage({ email: user.phone, type: "ban", meta: { name: user.firstName, reason } });
				return {
					status: false,
					statusCode: 406,
					data: {},
					message: "Ban for exceeding password reset attempts, please contact support.",
				};
			}
			await User.query().findOne({ id: user.id }).update({
				reset_password_attempts: attempt + 1,
				updated_at: new Date
			});

			return {
				status: true,
				statusCode: 400,
				data: {},
				message: "Token expired, Please try generating a new token.",
			};
		}
		const validated = await bcrypt.compare(password, user.password);
		if (validated === true) {
			return { status: false, statusCode: 400, data: {}, message: "You can not use the same password" }
		}

		let passwordHash: string = "";
	
		if (password) {
			passwordHash = await bcrypt.hash(password, parseInt(saltRounds));
		}

		await User.query().findOne({ id: user.id }).update({
			password: passwordHash,
			reset_password_attempts: 0,
			updated_at: new Date()
		});
		await Token.query().where({ identifier: checkToken.identifier }).delete();

		await emailMessage({ email: user.phone, type: "resetPassword", meta: { name: user.firstName } });

		return { status: true, statusCode: 200, data: {}, message: `Password reset successfully` }
	} catch (error: any) {
		console.log(`${logPrefix} error ===>`, error.message, error.stack);
		return { status: false, statusCode: 401, data: {}, message: "Failed to reset password, please try again in a few minutes " }
	}
}