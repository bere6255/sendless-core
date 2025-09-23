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
const User_1 = __importDefault(require("../../models/User"));
const generateToken_1 = __importDefault(require("../../helpers/generateToken"));
const phoneMessage_1 = __importDefault(require("../../helpers/messages/phoneMessage"));
const emailMessage_1 = __importDefault(require("../../helpers/messages/emailMessage"));
const util_1 = require("../../helpers/util");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const logPrefix = "[AUTH:SENDEMAILPHONEOTP:SERVICE]";
exports.default = ({ phoneEmail, type, metaData }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${logPrefix} init ===> `, JSON.stringify({ phoneEmail, type, metaData }));
    if (!["email", "phone"].includes(type)) {
        throw Object.assign(new AppError_1.default("Invalid type provided", 400), { logPrefix });
    }
    if (type === "email") {
        const checkEmail = yield User_1.default.query().findOne({ email: phoneEmail });
        if (checkEmail) {
            throw Object.assign(new AppError_1.default("Email already in use, please login", 400), { logPrefix });
        }
        const generateTokenRes = yield (0, generateToken_1.default)({ identifier: phoneEmail, type: metaData.type });
        const meta = generateTokenRes === null || generateTokenRes === void 0 ? void 0 : generateTokenRes.data;
        yield (0, emailMessage_1.default)({ email: phoneEmail, type: metaData.type, meta });
        return {
            statusCode: 200,
            status: "success",
            data: {},
            message: `A token has been sent to ****${phoneEmail.slice(4)}`,
        };
    }
    if (type === "phone") {
        if (!(metaData === null || metaData === void 0 ? void 0 : metaData.country)) {
            throw Object.assign(new AppError_1.default("Country is required", 400), { logPrefix });
        }
        const formatResult = (0, util_1.formartPhone)({ phone: phoneEmail, country: metaData.country });
        if (!formatResult.status) {
            throw Object.assign(new AppError_1.default("Country code not found", 400), { logPrefix });
        }
        const checkPhone = yield User_1.default.query().findOne({ phone: formatResult.phone });
        if (checkPhone) {
            throw Object.assign(new AppError_1.default("Phone already in use", 400), { logPrefix });
        }
        const generateTokenRes = yield (0, generateToken_1.default)({ identifier: formatResult.phone, type: metaData.type });
        const meta = generateTokenRes === null || generateTokenRes === void 0 ? void 0 : generateTokenRes.data;
        yield (0, phoneMessage_1.default)({ phone: formatResult.phone, type: metaData.type, meta });
        return {
            statusCode: 200,
            status: "success",
            data: {},
            message: `A token has been sent to ****${phoneEmail.slice(-4)}`,
        };
    }
    // Should never reach here because of initial type check
    throw Object.assign(new AppError_1.default("Invalid request type", 400), { logPrefix });
});
//# sourceMappingURL=sendRegisterPhoneEmailOtp.js.map