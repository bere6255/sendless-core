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
        wallet: joi_1.default.string().trim().required().messages({
            "string.base": "wallet should be a type of 'text'",
            "string.empty": "wallet cannot be empty",
            "any.required": "wallet is required",
        }),
        usernames: joi_1.default.array().items(joi_1.default.string().trim().required().messages({
            "string.base": "Each username should be a type of 'text'",
            "string.empty": "Usernames cannot contain empty strings",
            "any.required": "Each username is required"
        })).min(1).unique().required().messages({
            "array.base": "Usernames should be an array of strings",
            "array.min": "At least one username is required",
            "array.unique": "Usernames must be unique",
            "any.required": "Usernames field is required"
        }),
        amount: joi_1.default.number().min(100).required().messages({
            "string.base": "amount should be a type of 'text'",
            "string.empty": "amount cannot be empty",
            "any.required": "amount is required",
            "any.min": "minimum amount is 100",
        }),
        description: joi_1.default.any(),
        transactionPin: joi_1.default.any(),
        meta: joi_1.default.any()
    });
    let { error, value } = preForgotSchema.validate(input, { abortEarly: false });
    let newError;
    if (error) {
        newError = error.message.split(".");
    }
    return { errors: newError || null, value };
});
//# sourceMappingURL=validation.js.map