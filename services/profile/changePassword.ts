import User from "../../models/User"
import bcrypt from "bcryptjs"
import Bans from "../../models/Bans";
import emailMessage from "../../helpers/messages/emailMessage";
import AppError from "../../utils/AppError";

type changePassWord = {
	password: string;
	oldPassword: string
	user: any
}

const saltRounds = process.env.SALT_ROUNDS || '10';
const logPrefix = "[PROFILE:CHANGEPASSWORD:SERVICE]";
export default async ({ password, oldPassword, user }: changePassWord) => {

	console.log(`${logPrefix} init ==>  user_email: ${user.email}`);

	const validated = await bcrypt.compare(oldPassword, user.password);
	let attempt = 0;

	attempt = !user.reset_password_attempts ? 0 : parseInt(user.reset_password_attempts);
	if (validated === false) {
		if (attempt < 3) {
			attempt = attempt + 1;
			await User.query().findOne("id", "=", user.id).update({
				reset_password_attempts: attempt,
			});
		}
		if (attempt >= 3) {
			console.log(`${logPrefix} ban user_email ${user.email}  ===> ban for exceeding change password attempts`);
			const reason = "Ban for exceeding change password attempts";
			await User.query()
				.patch({ banned_at: new Date() })
				.where("id", "=", user.id);
			await Bans.query().insert({
				user_id: user.id,
				ban_by: "system:change_password",
				comment: reason,
				created_at: new Date,
				updated_at: new Date
			});

			await emailMessage({ email: user.email, type: "ban", meta: { name: user.firstName, reason } });
			throw new AppError(reason, 400, logPrefix, {});

		}
		throw new AppError("Failed to reset, Please try again", 400, logPrefix, {});

	}

	const validatedNew = await bcrypt.compare(password, user.password);

	if (validatedNew) {
		throw new AppError("For your security, please avoid using the same password", 400, logPrefix, {});
	}

	let passwordHash: any = await bcrypt.hash(password, parseInt(saltRounds));

	await User.query().findOne({ id: user.id }).update({
		password: passwordHash,
		reset_password_attempts: 0,
		updated_at: new Date()
	});

	await emailMessage({ email: user.email, type: "chagePassword", meta: { name: user.firstName } });


	return { status: "success", statusCode: 200, data: {}, message: `Password reset successfully` }

}