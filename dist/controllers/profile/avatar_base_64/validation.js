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
});
//# sourceMappingURL=validation.js.map