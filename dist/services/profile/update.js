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
const Address_1 = __importDefault(require("../../models/Address"));
const generateToken_1 = __importDefault(require("../../helpers/generateToken"));
const emailMessage_1 = __importDefault(require("../../helpers/messages/emailMessage"));
const redisConnection_1 = __importDefault(require("../../redis/redisConnection"));
const logPrefix = "[PROFILE:UPDATE:SERVICE]";
exports.default = ({ email, state, city, fullName, address, authUser }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(`${logPrefix} init user ${authUser.phone}, data ${JSON.stringify({ email, state, city, address, })}`);
    let verifyEmail = false;
    yield Address_1.default.query().insert({
        user_id: authUser.id,
        address,
        city,
        state,
        created_at: new Date(),
        updated_at: new Date(),
    });
    if (!authUser.fullName) {
        yield User_1.default.query().update({
            fullName,
        }).where({
            id: authUser.id
        });
    }
    if (!authUser.email || authUser.email !== email) {
        yield User_1.default.query().update({
            fullName,
            email,
        }).where({
            id: authUser.id
        });
        const generateTokenRes = yield (0, generateToken_1.default)({ identifier: email, type: "email-verification" });
        if (generateTokenRes.status) {
            if (generateTokenRes.data.token) {
                verifyEmail = true;
                yield (0, emailMessage_1.default)({ email, type: "register", meta: { token: (_a = generateTokenRes === null || generateTokenRes === void 0 ? void 0 : generateTokenRes.data) === null || _a === void 0 ? void 0 : _a.token } });
            }
        }
    }
    yield (0, redisConnection_1.default)({ type: "delete", key: `users:${authUser.id}`, value: null, time: null });
    return { status: "success", statusCode: 200, data: { verifyEmail }, message: `Profile updated successfully` };
});
//# sourceMappingURL=update.js.map