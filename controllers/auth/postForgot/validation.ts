import joi from "joi"

export default async (input: any) => {
		const postForgotSchema = joi.object({
			token: joi.string().trim().required().messages({
				"string.base": "email  should be a type of 'text'",
				"string.empty": "email  cannot be empty",
				"any.required": "email  is required",
			}),
		
			password: joi.string().min(8).required().messages({
				"string.base": "password should be a type of 'text'",
				"string.empty": "password cannot be empty",
				"string.min": "password must be minimum of 8 characters",
				"string.pattern.base":
					"this is not a valid password, password must be minimum eight characters, at least one letter and one number",
				"any.required": "password is required",
			}),
		});

		let { error, value } = postForgotSchema.validate(input, { abortEarly: false });
		let newError
		if (error) {
			newError = error.message.split(".");
		}
	
		return { errors: newError || null, value };
};
