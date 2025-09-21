import joi from "joi"

export default async (input: any) => {
	const preForgotSchema = joi.object({
		phoneTagEmail: joi.string().required().messages({
			"string.base": "Phone | Email | Tag number should be a type of 'text'",
			"string.empty": "Phone | Email | Tag number cannot be empty",
			"any.required": "Phone | Email | Tag number is required"
		})
	});
	
	let { error, value } = preForgotSchema.validate(input, { abortEarly: false });
	let newError
	if (error) {
		newError = error.message.split(".");
	}

	return { errors: newError || null, value };
};
