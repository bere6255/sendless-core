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
const Pin_1 = __importDefault(require("../../models/Pin"));
const Token_1 = __importDefault(require("../../models/Token"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../models/User"));
const Bans_1 = __importDefault(require("../../models/Bans"));
const moment_1 = __importDefault(require("moment"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
const MAX_ATTEMPTS = 5;
const logPrefix = "PIN:UPDATEPIN:SERVICE";
exports.default = ({ newPin, user, token }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${logPrefix} init user ${user.email}`);
    const pin = yield Pin_1.default.query().findOne({ user_id: user.id });
    if (!pin) {
        throw new AppError_1.default("Please set a transaction pin", 400, logPrefix, {});
    }
    const getToken = yield Token_1.default.query().findOne({ token });
    if (!getToken) {
        throw new AppError_1.default("Token not found, please try again", 400, logPrefix, {});
    }
    const timeDifference = (0, moment_1.default)().diff((0, moment_1.default)(getToken.created_at), 'minutes');
    if (timeDifference >= 10) {
        throw new AppError_1.default("Token expired, Please try generating a new token", 400, logPrefix, {});
    }
    if (getToken.identifier !== user.phone) {
        let pinAttempt = parseInt(pin.pin_attempts || '0');
        if (pinAttempt >= MAX_ATTEMPTS) {
            console.log(`${logPrefix} ban user ${user.email} for exceeding reset pin attempts`);
            yield banUser(user.id, user.email);
            throw new AppError_1.default("Too many incorrect attempts. Your account has been locked.", 403, logPrefix, {});
        }
        yield Pin_1.default.query()
            .patchAndFetchById(pin.id, { pin_attempts: `${pinAttempt + 1}` });
        throw new AppError_1.default(`Invalid token. You have ${MAX_ATTEMPTS - pinAttempt - 1} attempts remaining`, 400, logPrefix, {});
    }
    const isSameAsOldPin = yield bcryptjs_1.default.compare(newPin, pin.pin);
    if (isSameAsOldPin) {
        let pinAttempt = parseInt(pin.pin_attempts || '0');
        if (pinAttempt >= MAX_ATTEMPTS) {
            console.log(`${logPrefix} ban user ${user.email} for exceeding reset pin attempts`);
            yield banUser(user.id, user.email);
            throw new AppError_1.default("Too many incorrect attempts. Your account has been locked.", 403, logPrefix, {});
        }
        yield Pin_1.default.query()
            .patchAndFetchById(pin.id, { pin_attempts: `${pinAttempt + 1}` });
        throw new AppError_1.default(`You cannot reuse your old PIN. ${MAX_ATTEMPTS - pinAttempt - 1} attempts remaining`, 400, logPrefix, {});
    }
    const hashPin = yield bcryptjs_1.default.hash(newPin, saltRounds);
    const updateResult = yield Pin_1.default.query()
        .patchAndFetchById(pin.id, {
        pin: hashPin,
        pin_attempts: '0',
        updated_at: new Date(),
    });
    if (!updateResult) {
        throw new AppError_1.default("PIN not updated, please try again", 400, logPrefix, {});
    }
    // Optionally delete the token after successful use
    yield Token_1.default.query().deleteById(getToken.id);
    return {
        status: "success",
        statusCode: 201,
        data: {},
        message: "PIN updated"
    };
});
// Helper function to ban user
function banUser(userId, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        yield User_1.default.query().patch({ banned_at: new Date() }).where("id", userId);
        yield Bans_1.default.query().insert({
            user_id: userId,
            ban_by: "system:pin:otp",
            comment: "Ban for exceeding reset pin attempts",
            created_at: new Date(),
            updated_at: new Date()
        });
    });
}
//# sourceMappingURL=updatePing.js.map