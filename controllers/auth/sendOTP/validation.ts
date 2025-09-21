import joi from "joi"

export default async (input: any) => {
	const preForgotSchema = joi.object({
		emailPhone: joi.string().trim().min(8).max(30).required().messages({
			"string.base": "Email / phone should be a type of 'text'",
			"string.empty": "Email / phone cannot be empty",
			"string.min": "Email / phone should have a minimum length of {#limit}",
			"string.max": "Email / phone should have a maximum length of {#limit}",
			"any.required": "phone is required",
		}),
		type: joi.string().valid('email', 'phone').required().messages({
			"string.base": "Type should be a type of 'text'",
			"string.empty": "Type cannot be empty",
			"any.required": "Type is required",
		}),
		country: joi.any(),
	});

	let { error, value } = preForgotSchema.validate(input, { abortEarly: false });
	let newError
	if (error) {
		newError = error.message.split(".");
	}

	return { errors: newError || null, value };
};
