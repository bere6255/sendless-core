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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const emailMessage_1 = __importDefault(require("../../helpers/messages/emailMessage"));
const moment_1 = __importDefault(require("moment"));
const Bans_1 = __importDefault(require("../../models/Bans"));
const logPrefix = "AUTH:FORGOTPASSWORD:SERVICE";
const saltRounds = process.env.SALT_ROUNDS || '10';
exports.default = ({ password, token }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkToken = yield Token_1.default.query().findOne({ token, type: "password_reset" });
        if (!checkToken) {
            return {
                status: true,
                statusCode: 200,
                data: {},
                message: "Password reset successfully ",
            };
        }
        const user = yield User_1.default.query().findOne({ phone: checkToken.identifier });
        if (!user) {
            return {
                status: true,
                statusCode: 200,
                data: {},
                message: "Password reset successfully ",
            };
        }
        console.log(`${logPrefix} init for  phone ${user.phone}`);
        if (user.banned_at) {
            return {
                status: true,
                statusCode: 400,
                data: {},
                message: "Please contact support ",
            };
        }
        const timeDiference = (0, moment_1.default)(new Date()).diff((0, moment_1.default)(checkToken.created_at), 'minutes');
        const attempt = user.reset_password_attempts ? user.reset_password_attempts : 0;
        if (timeDiference >= 10) {
            yield Token_1.default.query().where({ token }).delete();
            if (attempt >= 5) {
                console.log(`${logPrefix} ban user ${user.phone}  ===> ban for exceeding reset password attempts`);
                const reason = "Ban for exceeding password reset attempts";
                yield User_1.default.query()
                    .update({ banned_at: new Date() })
                    .where("id", "=", user.id);
                yield Bans_1.default.query().insert({
                    user_id: user.id,
                    ban_by: "system:password:reset",
                    comment: reason,
                    created_at: new Date,
                    updated_at: new Date
                });
                yield (0, emailMessage_1.default)({ email: user.phone, type: "ban", meta: { name: user.firstName, reason } });
                return {
                    status: false,
                    statusCode: 406,
                    data: {},
                    message: "Ban for exceeding password reset attempts, please contact support.",
                };
            }
            yield User_1.default.query().findOne({ id: user.id }).update({
                reset_password_attempts: attempt + 1,
                updated_at: new Date
            });
            return {
                status: true,
                statusCode: 400,
                data: {},
                message: "Token expired, Please try generating a new token.",
            };
        }
        const validated = yield bcryptjs_1.default.compare(password, user.password);
        if (validated === true) {
            return { status: false, statusCode: 400, data: {}, message: "You can not use the same password" };
        }
        let passwordHash = "";
        if (password) {
            passwordHash = yield bcryptjs_1.default.hash(password, parseInt(saltRounds));
        }
        yield User_1.default.query().findOne({ id: user.id }).update({
            password: passwordHash,
            reset_password_attempts: 0,
            updated_at: new Date()
        });
        yield Token_1.default.query().where({ identifier: checkToken.identifier }).delete();
        yield (0, emailMessage_1.default)({ email: user.phone, type: "resetPassword", meta: { name: user.firstName } });
        return { status: true, statusCode: 200, data: {}, message: `Password reset successfully` };
    }
    catch (error) {
        console.log(`${logPrefix} error ===>`, error.message, error.stack);
        return { status: false, statusCode: 401, data: {}, message: "Failed to reset password, please try again in a few minutes " };
    }
});
//# sourceMappingURL=ForgotPassword.js.map