import Address from "../../models/Address";
import redisConnection from "../../redis/redisConnection";
import AppError from "../../utils/AppError";
const logPrefix = "[PROFILE:ADDRESS:SERVICE]";
type address = {
	address: string
	city: string
	country: string
	state: string
	user: any
}

export default async ({ address, city, state, country, user }: address) => {

	console.log(`${logPrefix} init user ${user.phone}, data ${JSON.stringify({ address, city, state })}`);

	const checkNextkin = await Address.query().findOne({ user_id: user.id });
	if (checkNextkin) {
		throw new AppError("address already added", 400, logPrefix, {});
	}

	await Address.query().insert({
		user_id: user.id,
		address,
		country,
		city,
		state,
		created_at: new Date(),
		updated_at: new Date()
	});

	await redisConnection({ type: "delete", key: `users:${user.id}`, value: null, time: null });

	return { status: "success", statusCode: 200, data: {}, message: `Address added successfully` }

}