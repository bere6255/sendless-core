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
const Token_1 = __importDefault(require("../../models/Token"));
const phoneMessage_1 = __importDefault(require("../../helpers/messages/phoneMessage"));
const Bans_1 = __importDefault(require("../../models/Bans"));
const generateToken_1 = __importDefault(require("../../helpers/generateToken"));
const logPrefix = "[AUTH:RESETPASSWORDTOKEN:SERVICE]";
exports.default = ({ phone }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.query().findOne({ phone });
        if (!user) {
            return {
                status: true,
                statusCode: 200,
                data: {},
                message: `A reset token have been sent to ${phone}`,
            };
        }
        if (user.banned_at) {
            return {
                status: true,
                statusCode: 400,
                data: {},
                message: "Please contact support ",
            };
        }
        const checkTokens = yield Token_1.default.query().where({ identifier: user.phone, type: "password_reset" });
        if (checkTokens.length >= 5) {
            console.log(`${logPrefix} ban email ${user.phone}  ===> ban for exceeding reset password attempts`);
            const reason = "Ban for exceeding password reset attempts";
            yield User_1.default.query()
                .patch({ banned_at: new Date() })
                .where("id", "=", user.id);
            yield Bans_1.default.query().insert({
                user_id: user.id,
                ban_by: "system:password:reset",
                comment: reason,
                created_at: new Date,
                updated_at: new Date
            });
            yield (0, phoneMessage_1.default)({ phone: user.phone, type: "ban", meta: { name: user.firstName, reason } });
            return { status: true, statusCode: 200, data: {}, message: `A reset token have been sent to ${user.phone}` };
        }
        let otp;
        const generateTokenRes = yield (0, generateToken_1.default)({ identifier: phone, type: "password_reset" });
        if (generateTokenRes.status) {
            otp = generateTokenRes.data.token;
        }
        yield (0, phoneMessage_1.default)({ phone: user.phone, type: "resetPassword", meta: { name: user.firstName, token: otp } });
        return { status: true, statusCode: 200, data: {}, message: `A reset token have been sent to ${user.phone}` };
    }
    catch (error) {
        console.log("Send Forgot Password error ===>", error.message, error.stack);
        return { status: false, statusCode: 401, data: {}, message: "Failed to send reset password token, please try again in a few minutes " };
    }
});
//# sourceMappingURL=resetPasswordToken.js.map