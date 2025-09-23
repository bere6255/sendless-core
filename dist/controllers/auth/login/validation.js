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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.default = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const loginSchema = joi_1.default.object({
        emailPhone: joi_1.default.string().trim().required().messages({
            "string.base": "Email or phone  should be a type of 'text'",
            "string.empty": "Email or phone  cannot be empty",
            "any.required": "Email or phone  is required",
        }),
        type: joi_1.default.string().valid('email', 'phone').required().messages({
            "string.base": "Type should be a type of 'text'",
            "string.empty": "Type cannot be empty",
            "any.required": "Type is required",
        }),
        password: joi_1.default.string().min(8).required().messages({
            "string.base": "password should be a type of 'text'",
            "string.empty": "password cannot be empty",
            "string.min": "password must be minimum of 8 characters",
            "string.pattern.base": "this is not a valid password, password must be minimum eight characters, at least one letter and one number",
            "any.required": "password is required",
        })
    });
    let { error, value } = loginSchema.validate(input, { abortEarly: false });
    let newError;
    if (error) {
        newError = error.message.split(".");
    }
    return { errors: newError || null, value };
});
//# sourceMappingURL=validation.js.map