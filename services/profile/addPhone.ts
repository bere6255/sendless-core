import User from "../../models/User"
import { formartPhone } from "../../helpers/util";
import verifyToken from "../../helpers/verifyToken";
import AppError from "../../utils/AppError";
const logPrefix = "[PROFILE:ADDPHONE:SERVICE]";
type addPhone = {
	phone: string
	country: string
	token: string
	userId: string
}

export default async ({ phone, country, token, userId }: addPhone) => {

	console.log(`${logPrefix} init phone ${phone}, country ${country}`);


	const verifyTokenRes = await verifyToken({ token, identifier: phone, type: "phone_verification" })

	if (!verifyTokenRes.status) {
		console.log(`${logPrefix} invalid token ===? `, phone);
		throw new AppError(verifyTokenRes.message, 400, logPrefix, {});
	}

	// check if phone exist
	const checkPhone = await User.query()
		.findOne({ phone });

	if (checkPhone) {
		throw new AppError("Account already exist with this phone", 400, logPrefix, {});

	}

	// check if user has phone
	const checkUserPhone = await User.query()
		.findOne({ id: userId });

	if (checkUserPhone) {
		if (checkUserPhone.phone_verified_at) {
			throw new AppError("Phone already added", 400, logPrefix, {});
		}

	}

	await User.query().update({
		phone,
		country,
		phone_verified_at: new Date,
		updated_at: new Date
	}).where({
		id: userId
	});

	return { status: "success", statusCode: 200, data: {}, message: `Phone added successfully` }

}