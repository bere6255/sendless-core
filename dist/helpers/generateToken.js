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
const Token_1 = __importDefault(require("../models/Token"));
const generateOTP_1 = __importDefault(require("../utils/generateOTP"));
const logPrefix = "[GEENERATE TOKEN]";
exports.default = ({ identifier, type }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init`);
        const otp = (0, generateOTP_1.default)();
        yield Token_1.default.query().insert({
            identifier,
            token: otp,
            type,
            validity: 5,
            created_at: new Date(),
            updated_at: new Date()
        });
        return { status: true, data: { token: otp }, message: "successful" };
    }
    catch (error) {
        console.log(`${logPrefix} Error ===> `, error.message, error.stack);
        return { status: false, data: { token: null }, message: "Error generating token" };
    }
});
//# sourceMappingURL=generateToken.js.map