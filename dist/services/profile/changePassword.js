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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Bans_1 = __importDefault(require("../../models/Bans"));
const emailMessage_1 = __importDefault(require("../../helpers/messages/emailMessage"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const saltRounds = process.env.SALT_ROUNDS || '10';
const logPrefix = "[PROFILE:CHANGEPASSWORD:SERVICE]";
exports.default = ({ password, oldPassword, user }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${logPrefix} init ==>  user_email: ${user.email}`);
    const validated = yield bcryptjs_1.default.compare(oldPassword, user.password);
    let attempt = 0;
    attempt = !user.reset_password_attempts ? 0 : parseInt(user.reset_password_attempts);
    if (validated === false) {
        if (attempt < 3) {
            attempt = attempt + 1;
            yield User_1.default.query().findOne("id", "=", user.id).update({
                reset_password_attempts: attempt,
            });
        }
        if (attempt >= 3) {
            console.log(`${logPrefix} ban user_email ${user.email}  ===> ban for exceeding change password attempts`);
            const reason = "Ban for exceeding change password attempts";
            yield User_1.default.query()
                .patch({ banned_at: new Date() })
                .where("id", "=", user.id);
            yield Bans_1.default.query().insert({
                user_id: user.id,
                ban_by: "system:change_password",
                comment: reason,
                created_at: new Date,
                updated_at: new Date
            });
            yield (0, emailMessage_1.default)({ email: user.email, type: "ban", meta: { name: user.firstName, reason } });
            throw new AppError_1.default(reason, 400, logPrefix, {});
        }
        throw new AppError_1.default("Failed to reset, Please try again", 400, logPrefix, {});
    }
    const validatedNew = yield bcryptjs_1.default.compare(password, user.password);
    if (validatedNew) {
        throw new AppError_1.default("For your security, please avoid using the same password", 400, logPrefix, {});
    }
    let passwordHash = yield bcryptjs_1.default.hash(password, parseInt(saltRounds));
    yield User_1.default.query().findOne({ id: user.id }).update({
        password: passwordHash,
        reset_password_attempts: 0,
        updated_at: new Date()
    });
    yield (0, emailMessage_1.default)({ email: user.email, type: "chagePassword", meta: { name: user.firstName } });
    return { status: "success", statusCode: 200, data: {}, message: `Password reset successfully` };
});
//# sourceMappingURL=changePassword.js.map