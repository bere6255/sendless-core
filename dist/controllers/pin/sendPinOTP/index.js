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
const User_1 = __importDefault(require("../../../models/User"));
const phoneMessage_1 = __importDefault(require("../../../helpers/messages/phoneMessage"));
const Bans_1 = __importDefault(require("../../../models/Bans"));
const Pin_1 = __importDefault(require("../../../models/Pin"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const generateToken_1 = __importDefault(require("../../../helpers/generateToken"));
const logPrefix = "PIN:SENDPINOTP:CONTROLLER";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        console.log(`${logPrefix} init user ${user.phone} ===> `);
        if (!user.phone) {
            throw new AppError_1.default("Please add your mobile phone to continue this process", 400, logPrefix, {});
        }
        const checkPin = yield Pin_1.default.query().findOne({ user_id: user.id });
        if (!checkPin) {
            throw new AppError_1.default("Please creae your transaction pin to continue this process", 400, logPrefix, {});
        }
        let attempt = parseInt(checkPin.reset_attempts + 1) || 0;
        yield Pin_1.default.query().findOne({ user_id: user.id }).update({
            reset_attempts: attempt,
            updated_at: new Date
        });
        if (attempt >= 5) {
            console.log(`${logPrefix} ban user ${user.email}  ===> ban for exceeding pin reset otp attempts`);
            yield User_1.default.query()
                .patch({ banned_at: new Date() })
                .where("id", "=", user.id);
            yield Bans_1.default.query().insert({
                user_id: user.id,
                ban_by: "system:pin:otp",
                comment: "Ban for exceeding pin reset otp attempts",
                created_at: new Date,
                updated_at: new Date
            });
            throw new AppError_1.default("Ban for exceeding pin reset otp attempts, please contact support.", 400, logPrefix, {});
        }
        let otp;
        const generateTokenRes = yield (0, generateToken_1.default)({ identifier: user.phone, type: "pin" });
        if (generateTokenRes.status) {
            otp = generateTokenRes.data.token;
        }
        // Send phone token to provided phone
        yield (0, phoneMessage_1.default)({ phone: user.phone, type: "pin", meta: { token: otp } });
        // .substr(-5)
        return res.status(200).send({
            status: "success",
            data: {},
            message: `A token have been sent to ****${user.phone.slice(user.phone.length - 4)}`,
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map