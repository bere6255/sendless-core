import joi from "joi"

export default async (input: any) => {
	const preForgotSchema = joi.object({
		pin: joi.string().trim().min(4).max(4).required().messages({
			"string.base": "New pin should be a type of 'text'",
			"string.empty": "New pin cannot be empty",
			"any.required": "New pin is required",
			"string.min": "New pin must be minimum of 4 characters",
			"string.max": "New pin must be maximum of 4 characters",
		}),
		token: joi.string().trim().required().messages({
			"string.base": "token should be a type of 'text'",
			"string.empty": "token cannot be empty",
			"any.required": "token is required"
		})
	});
	
	let { error, value } = preForgotSchema.validate(input, { abortEarly: false });
	let newError
	if (error) {
		newError = error.message.split(".");
	}

	return { errors: newError || null, value };
};
