import joi from "joi"

export default async (input: any) => {
	const preForgotSchema = joi.object({
		wallet: joi.string().trim().required().messages({
			"string.base": "wallet should be a type of 'text'",
			"string.empty": "wallet cannot be empty",
			"any.required": "wallet is required",
		}),
		usernames: joi.array().items(
			joi.string().trim().required().messages({
				"string.base": "Each username should be a type of 'text'",
				"string.empty": "Usernames cannot contain empty strings",
				"any.required": "Each username is required"
			})
		).min(1).unique().required().messages({
			"array.base": "Usernames should be an array of strings",
			"array.min": "At least one username is required",
			"array.unique": "Usernames must be unique",
			"any.required": "Usernames field is required"
		}),
		amount: joi.number().min(100).required().messages({
			"string.base": "amount should be a type of 'text'",
			"string.empty": "amount cannot be empty",
			"any.required": "amount is required",
			"any.min": "minimum amount is 100",
		}),
		description: joi.any(),
		transactionPin: joi.any(),
		meta: joi.any()
	});

	let { error, value } = preForgotSchema.validate(input, { abortEarly: false });
	let newError
	if (error) {
		newError = error.message.split(".");
	}

	return { errors: newError || null, value };
};
