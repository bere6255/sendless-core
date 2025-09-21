import joi from "joi"

export default async (input: any) => {
	const preForgotSchema = joi.object({
		token: joi.string().trim().required().messages({
			"string.base": "Token should be a type of 'text'",
			"string.empty": "Token cannot be empty",
			"any.required": "Token is required"
		})
	});

	let { error, value } = preForgotSchema.validate(input, { abortEarly: false });
	let newError
	if (error) {
		newError = error.message.split(".");
	}

	return { errors: newError || null, value };
};
