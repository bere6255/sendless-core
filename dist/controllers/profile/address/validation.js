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
    let newError;
    if (error) {
        newError = error.message.split(".");
    }
    return { errors: newError || null, value };
});
//# sourceMappingURL=validation.js.map