"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
exports.default = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const registerSchema = joi.object({
        fullName: joi.string().required().messages({
            "string.base": "Full name should be a type of 'text'",
            "string.empty": "Full name cannot be empty",
            "any.required": "Full name is required",
        }),
        email: joi.string().trim().required().messages({
            "string.base": "Email should be a type of 'text'",
            "string.empty": "Email cannot be empty",
            "any.required": "Email is required",
        }),
        phone: joi.string().trim().required().messages({
            "string.base": "Type should be a type of 'text'",
            "string.empty": "Type cannot be empty",
            "any.required": "Type is required",
        }),
        refCode: joi.any(),
        password: joi.string().min(8).required().messages({
            "string.base": "Password should be a type of 'text'",
            "string.empty": "Password cannot be empty",
            "string.min": "Password must be minimum of 8 characters",
        }),
    });
    let { error, value } = registerSchema.validate(input, { abortEarly: false });
    let newError;
    if (error) {
        newError = error.message.split(".");
    }
    return { errors: newError || null, value };
});
//# sourceMappingURL=validation.js.map