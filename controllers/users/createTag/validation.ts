import joi from "joi"

export default async (input: any) => {
		const preForgotSchema = joi.object({
			tag: joi.string().trim().required().messages({
				"string.base": "Tag should be a type of 'text'",
				"string.empty": "Tag cannot be empty",
				"any.required": "Tag is required",
			}),
		});

		let { error, value } = preForgotSchema.validate(input, { abortEarly: false });
		let newError
		if (error) {
			newError = error.message.split(".");
		}
	
		return { errors: newError || null, value };
};
