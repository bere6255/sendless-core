import User from "../../models/User";
import Pin from "../../models/Pin";
import Address from "../../models/Address";
import VerificationDocuments from "../../models/VerificationDocuments";
import redisConnection from "../../redis/redisConnection";
import AppError from "../../utils/AppError";
import kucoinClient from "../../configs/kucoinClient";
import { Account } from "kucoin-universal-sdk";
import { AddSubAccountReq } from "kucoin-universal-sdk/dist/generate/account/subaccount";
const { AccessEnum } = Account.SubAccount.AddSubAccountReq;
const logPrefix = "[PROFILE:GETUSER:SERVICE]";
type addPhone = {
	userId: string
}

function generateUniqueSubAccountName(baseName: string): string {
	// 1. Clean the base name:
	//    - Remove all non-alphanumeric characters (including spaces, punctuation, symbols)
	//    - Convert to a consistent case (optional, but often good for usernames)
	let cleanedName = baseName.trim().replace(/[^a-zA-Z0-9]/g, ''); // <-- MODIFIED LINE

	// If, after cleaning, the name is empty, we need a fallback.
	// This provides a default to build upon if the input was like "!" or "  "
	if (cleanedName.length === 0) {
		cleanedName = 'user'; // A simple fallback base name
	}

	// 2. Ensure it has at least one letter and one number for compliance.
	//    We'll prefix them for robustness, ensuring they aren't truncated later.
	if (!/[a-zA-Z]/.test(cleanedName)) {
		cleanedName = 'a' + cleanedName;
	}
	if (!/\d/.test(cleanedName)) {
		cleanedName = '1' + cleanedName;
	}

	// 3. Add a timestamp (milliseconds) for better uniqueness
	const timestamp = Date.now().toString();
	cleanedName += timestamp;

	// 4. Add a short random alphanumeric suffix for extra uniqueness
	const randomSuffixLength = 4; // You can adjust this length
	const alphanumericChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const getRandomChar = () => alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)];

	let randomSuffix = '';
	for (let i = 0; i < randomSuffixLength; i++) {
		randomSuffix += getRandomChar();
	}
	cleanedName += randomSuffix;

	// 5. Pad to minimum length (7) if necessary
	//    (Unlikely to be needed after adding timestamp and random suffix, but good for safety)
	while (cleanedName.length < 7) {
		cleanedName += getRandomChar();
	}

	// 6. Truncate to maximum length (32) if necessary
	if (cleanedName.length > 32) {
		// Truncate from the right, keeping the important parts (cleaned base + prefixes + uniqueness suffix)
		cleanedName = cleanedName.substring(0, 32);
	}

	// Final sanity check (highly unlikely to fail after prefixing and padding, but defensive)
	// If somehow a name became too short after a complex sequence of truncations/cleaning,
	// ensure it's re-padded.
	while (cleanedName.length < 7 && /[a-zA-Z]/.test(cleanedName) && /\d/.test(cleanedName)) {
		cleanedName += getRandomChar();
	}


	return cleanedName;
}

export default async ({ userId }: addPhone) => {
	console.log(`${logPrefix} init ${userId}`);
	let formatedUser = <any>{};
	let isPin = false;
	let isAddress = false;
	let isNextKin = false;
	let isDocs = false;
	// get user from redis
	const getUser = await redisConnection({ type: "get", key: `users:${userId}`, value: null, time: null });


	if (!getUser) {
		const userProfile = await User.query().findOne({ id: userId })
			.withGraphFetched("address");

		if (!userProfile) {
			throw new AppError("User profile not found", 400, logPrefix, {});
		}


		formatedUser = userProfile.user();

		delete userProfile?.address?.created_at;
		delete userProfile?.address?.updated_at;
		delete userProfile?.address?.id;
		delete userProfile?.address?.user_id;
		delete userProfile?.address?.deleted_at;

		formatedUser.address = {
			...userProfile?.address
		}
		const checkPin = await Pin.query().findOne({ user_id: userId })
		if (checkPin) {
			isPin = true;
		}

		const checkAddress = await Address.query().where({ user_id: userId });
		if (checkAddress.length > 0) {
			isAddress = true
		}

		const checkDocs = await VerificationDocuments.query().where({ user_id: userId, status: "successful" });
		if (checkDocs.length > 0) {
			isDocs = true;
		}

		formatedUser.isPin = isPin
		formatedUser.isAddress = isAddress
		formatedUser.isNextKin = isNextKin
		formatedUser.isDocs = isDocs

		await redisConnection({ type: "lock", key: `users:${userProfile.id}`, value: JSON.stringify(formatedUser), time: 60 });
	} else {
		formatedUser = JSON.parse(getUser);
	}



	if (isDocs) {
		const subName = generateUniqueSubAccountName(formatedUser.email || formatedUser.phone)
		console.log("checking sub name ===> ", subName);

		const subAccountRequest = AddSubAccountReq.create({
			access: AccessEnum.SPOT, // This is correct now, using the enum member
			password: formatedUser.email || formatedUser.phone,
			subName: subName,
			// REMOVE THE 'toJson' LINE COMPLETELY from here
		});

		const accountApi = kucoinClient().restService().getAccountService().getSubAccountApi().addSubAccount(
			subAccountRequest // Pass the created object here
		);
		accountApi
			.then(async result => {
				console.log('Sub-account created successfully:', result);
				// Process the result if needed
				await User.query().findOne({ id: userId }).update({ account: result.uid })
			})
			.catch(error => {
				console.error('Failed to create sub-account:', error);
				// Handle the error appropriately
			});

	}


	return { statusCode: 200, status: "success", data: { user: formatedUser }, message: "User profile" }

}