const joi = require("joi");

export default async (input: any) => {
	const registerSchema = joi.object({
		fullName: joi.string().required().messages({
			"string.base": "Full name should be a type of 'text'",
			"string.empty": "Full name cannot be empty",
			"any.required": "Full name is required",
		}),
		email: joi.string().required().messages({
			"string.base": "Email should be a type of 'text'",
			"string.empty": "Email cannot be empty",
			"any.required": "Email is required",
		}),
		state: joi.string().required().messages({
			"string.base": "State should be a type of 'text'",
			"string.empty": "State cannot be empty",
			"any.required": "State is required",
		}),
		city: joi.string().required().messages({
			"string.base": "City should be a type of 'text'",
			"string.empty": "City cannot be empty",
			"any.required": "City is required",
		}),
		address: joi.string().required().messages({
			"string.base": "address should be a type of 'text'",
			"string.empty": "address cannot be empty",
			"any.required": "address is required",
		})

	});

	let { error, value } = registerSchema.validate(input, { abortEarly: false });
	let newError
	if (error) {
		newError = error.message.split(".");
	}

	return { errors: newError || null, value };
};
