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
const validation_1 = __importDefault(require("./validation"));
const sendRegisterPhoneEmailOtp_1 = __importDefault(require("../../../services/auth/sendRegisterPhoneEmailOtp"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const logPrefix = "[AUTH:SENDPHONEEMAILTOKEN:CONTROLLER]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { errors, value } = yield (0, validation_1.default)(req.body);
        if (errors) {
            throw new AppError_1.default(errors[0], 400, logPrefix, errors);
        }
        const { emailPhone, type, country, } = value;
        console.log(`${logPrefix} init ===> `, emailPhone);
        const sendRegisterPhoneEmailOtpRes = yield (0, sendRegisterPhoneEmailOtp_1.default)({ phoneEmail: emailPhone, type, metaData: { type: "register", country } });
        return res.status(sendRegisterPhoneEmailOtpRes.statusCode).send({
            status: sendRegisterPhoneEmailOtpRes.status,
            data: sendRegisterPhoneEmailOtpRes.data,
            message: sendRegisterPhoneEmailOtpRes.message
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map