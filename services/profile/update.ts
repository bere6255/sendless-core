import User from "../../models/User";
import Address from "../../models/Address";
import VerificationDocuments from "../../models/VerificationDocuments";
import generateToken from "../../helpers/generateToken";
import emailMessage from "../../helpers/messages/emailMessage";
import redisConnection from "../../redis/redisConnection";
const logPrefix = "[PROFILE:UPDATE:SERVICE]";
type update = {
	fullName: string
	email: string
	state: string
	city: string
	address: string
	authUser: any
}

export default async ({ email, state, city, fullName, address, authUser }: update) => {

	console.log(`${logPrefix} init user ${authUser.phone}, data ${JSON.stringify({ email, state, city, address, })}`);
	let verifyEmail = false;
	await Address.query().insert({
		user_id: authUser.id,
		address,
		city,
		state,
		created_at: new Date(),
		updated_at: new Date(),
	});
	if (!authUser.fullName) {
		await User.query().update({
			fullName,
		}).where({
			id: authUser.id
		});
	}
	if (!authUser.email || authUser.email !== email) {
		await User.query().update({
			fullName,
			email,
		}).where({
			id: authUser.id
		});

		const generateTokenRes = await generateToken({ identifier: email, type: "email-verification" });
		if (generateTokenRes.status) {
			if (generateTokenRes.data.token) {
				verifyEmail = true;
				await emailMessage({ email, type: "register", meta: { token: generateTokenRes?.data?.token } })
			}
		}
	}

	await redisConnection({ type: "delete", key: `users:${authUser.id}`, value: null, time: null });
	return { status: "success", statusCode: 200, data: { verifyEmail }, message: `Profile updated successfully` }

}