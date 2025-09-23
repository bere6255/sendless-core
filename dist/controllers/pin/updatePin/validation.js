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
    const preForgotSchema = joi_1.default.object({
        pin: joi_1.default.string().trim().min(4).max(4).required().messages({
            "string.base": "New pin should be a type of 'text'",
            "string.empty": "New pin cannot be empty",
            "any.required": "New pin is required",
            "string.min": "New pin must be minimum of 4 characters",
            "string.max": "New pin must be maximum of 4 characters",
        }),
        token: joi_1.default.string().trim().required().messages({
            "string.base": "token should be a type of 'text'",
            "string.empty": "token cannot be empty",
            "any.required": "token is required"
        })
    });
    let { error, value } = preForgotSchema.validate(input, { abortEarly: false });
    let newError;
    if (error) {
        newError = error.message.split(".");
    }
    return { errors: newError || null, value };
});
//# sourceMappingURL=validation.js.map