const joi = require("joi");

export default async (input: any) => {
	const schema = joi.object({
		image: joi.string().dataUri().required().messages({
			"string.base": "image should be a type of 'base64'",
			"string.empty": "image cannot be empty",
			"any.required": "image is required",
		}),
	});

	let { error, value } = schema.validate(input, { abortEarly: false });
	if (error) {
		error = error.message.split(".");
	}

	return { errors: error || null, value };
};
