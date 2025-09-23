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
        phone: joi.string().trim().min(8).max(30).required().messages({
            "string.base": "phone should be a type of 'text'",
            "string.empty": "phone cannot be empty",
            "string.min": "phone should have a minimum length of {#limit}",
            "string.max": "phone should have a maximum length of {#limit}",
            "any.required": "phone is required",
        }),
        token: joi.string().required().messages({
            "string.base": "token should be a type of 'text'",
            "string.empty": "token cannot be empty",
            "string.min": "token must be minimum of 8 characters",
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