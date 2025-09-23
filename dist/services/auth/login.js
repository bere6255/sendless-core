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
const Bans_1 = __importDefault(require("../../models/Bans"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateJWT_1 = __importDefault(require("../../helpers/generateJWT"));
const getUser_1 = __importDefault(require("../profile/getUser"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const logPrefixDefault = "[SERVICE:AUTH:LOGIN]";
const MAX_LOGIN_ATTEMPTS = 5;
exports.default = ({ emailPhone, password, userAgent, logPrefix = logPrefixDefault, }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.query()
        .findOne({ email: emailPhone })
        .orWhere({ phone: emailPhone })
        .whereNull("deleted_at");
    if (!user) {
        throw new AppError_1.default("Wrong email and password combination", 400, logPrefix, {});
    }
    // Check for existing bans and ban status first
    if (user.login_attempts >= MAX_LOGIN_ATTEMPTS || user.banned_at) {
        throw new AppError_1.default("Ban for exceeding login attempts", 406, logPrefix, {});
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        const newAttempts = (user.login_attempts || 0) + 1;
        yield User_1.default.query().findById(user.id).patch({ login_attempts: newAttempts });
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            console.log(`${logPrefix} Banning user_id ${user.id} due to failed login attempts`);
            yield User_1.default.query().findById(user.id).patch({ banned_at: new Date() });
            yield Bans_1.default.query().insert({
                user_id: user.id,
                ban_by: "system:login",
                comment: "Ban for exceeding login attempts",
            });
            throw new AppError_1.default("Ban for exceeding login attempts", 406, logPrefix, {});
        }
        throw new AppError_1.default("Wrong email and password combination", 400, logPrefix, {});
    }
    // Login successful
    yield User_1.default.query().findById(user.id).patch({ login_attempts: 0 });
    const token = (0, generateJWT_1.default)(user.id);
    const userProfile = yield (0, getUser_1.default)({ userId: user.id });
    // await emailMessage({
    //   email: user.email,
    //   type: "login",
    //   meta: { name: user.fullName, userAgent },
    // });
    return {
        status: "success",
        statusCode: 200,
        data: Object.assign({ token }, userProfile.data),
        message: "Login successful",
    };
});
//# sourceMappingURL=login.js.map