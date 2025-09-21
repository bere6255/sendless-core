const joi = require("joi");

export default async (input: any) => {
	const registerSchema = joi.object({
		phone: joi.string().trim().min(8).max(30).required().messages({
			"string.base": "phone should be a type of 'text'",
			"string.empty": "phone cannot be empty",
			"string.min": "phone should have a minimum length of {#limit}",
			"string.max": "phone should have a maximum length of {#limit}",
			"any.required": "phone is required",
		}),
		token: joi.string().required().messages({
			"string.base": "token should be a type of 'text'",
			"string.empty": "token cannot be empty",
			"string.min": "token must be minimum of 8 characters",
		})
	});

	let { error, value } = registerSchema.validate(input, { abortEarly: false });
	let newError
	if (error) {
		newError = error.message.split(".");
	}

	return { errors: newError || null, value };
};
