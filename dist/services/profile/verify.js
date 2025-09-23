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
const Token_1 = __importDefault(require("../../models/Token"));
const User_1 = __importDefault(require("../../models/User"));
const redisConnection_1 = __importDefault(require("../../redis/redisConnection"));
const logPrefix = "[SERVICE:PROFILE:VERIFY]";
exports.default = ({ user, token }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init ===> `, JSON.stringify({ phone: user.phone }));
        let type = "Email";
        const getToken = yield Token_1.default.query().findOne({ token });
        if (!getToken) {
            return { status: false, statusCode: 400, data: {}, message: "Token not found , Please try again" };
        }
        if (getToken.type === "email-verification") {
            if (!user.email) {
                return { status: false, statusCode: 400, data: {}, message: "please add an email address to continue" };
            }
            if (user.email !== getToken.identifier) {
                return { status: false, statusCode: 400, data: {}, message: "Token mismatch, Please try again" };
            }
            yield User_1.default.query().findByIds(user.id).update({
                email_verified_at: new Date,
                updated_at: new Date
            });
            yield (0, redisConnection_1.default)({ type: "delete", key: `users:${user.id}`, value: null, time: null });
        }
        return { status: true, statusCode: 200, data: {}, message: `${type} verified successfully` };
    }
    catch (error) {
        console.log(`${logPrefix} error ===> `, error.message, error.stack);
        return { status: false, statusCode: 400, data: {}, message: "please try again" };
    }
});
//# sourceMappingURL=verify.js.map