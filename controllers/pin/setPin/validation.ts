import joi from "joi"

export default async (input: any) => {
	const preForgotSchema = joi.object({
		pin: joi.string().trim().min(4).max(4).required().messages({
			"string.base": "pin should be a type of 'text'",
			"string.empty": "pin cannot be empty",
			"any.required": "pin is required",
			"string.min": "Pin must be minimum of 4 characters",
			"string.max": "Pin must be maximum of 4 characters",
		})
	});

	let { error, value } = preForgotSchema.validate(input, { abortEarly: false });
	let newError
	if (error) {
		newError = error.message.split(".");
	}

	return { errors: newError || null, value };
};
