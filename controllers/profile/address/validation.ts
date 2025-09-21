const joi = require("joi");

export default async (input: any) => {
	const registerSchema = joi.object({
		address: joi.string().required().messages({
			"string.base": "Address should be a type of 'text'",
			"string.empty": "Address cannot be empty",
			"any.required": "Address is required",
		}),
		city: joi.string().required().messages({
			"string.base": "City should be a type of 'text'",
			"string.empty": "City cannot be empty",
			"any.required": "City is required",
		}),
		country: joi.string().required().messages({
			"string.base": "Country should be a type of 'text'",
			"string.empty": "Country cannot be empty",
			"any.required": "Country is required",
		}),
		state: joi.string().required().messages({
			"string.base": "State should be a type of 'text'",
			"string.empty": "State cannot be empty",
			"any.required": "State is required",
		})
	});

	let { error, value } = registerSchema.validate(input, { abortEarly: false });
	let newError
	if (error) {
		newError = error.message.split(".");
	}

	return { errors: newError || null, value };
};
