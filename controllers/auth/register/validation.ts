const joi = require("joi");

export default async (input: any) => {
	const registerSchema = joi.object({
		fullName: joi.string().required().messages({
			"string.base": "Full name should be a type of 'text'",
			"string.empty": "Full name cannot be empty",
			"any.required": "Full name is required",
		}),
		email: joi.string().trim().required().messages({
			"string.base": "Email should be a type of 'text'",
			"string.empty": "Email cannot be empty",
			"any.required": "Email is required",
		}),
		phone: joi.string().trim().required().messages({
			"string.base": "Type should be a type of 'text'",
			"string.empty": "Type cannot be empty",
			"any.required": "Type is required",
		}),
		refCode: joi.any(),
		password: joi.string().min(8).required().messages({
			"string.base": "Password should be a type of 'text'",
			"string.empty": "Password cannot be empty",
			"string.min": "Password must be minimum of 8 characters",
		}),
	});

	let { error, value } = registerSchema.validate(input, { abortEarly: false });
	let newError
	if (error) {
		newError = error.message.split(".");
	}

	return { errors: newError || null, value };
};
