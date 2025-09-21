import joi from "joi"

export default async (input: any) => {
		const postForgotSchema = joi.object({
			token: joi.string().trim().required().messages({
				"string.base": "token  should be a type of 'text'",
				"string.empty": "token  cannot be empty",
				"any.required": "token  is required",
			})
		});

		let { error, value } = postForgotSchema.validate(input, { abortEarly: false });
		let newError
		if (error) {
			newError = error.message.split(".");
		}
	
		return { errors: newError || null, value };
};
