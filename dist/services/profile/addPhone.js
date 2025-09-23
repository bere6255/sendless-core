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
const verifyToken_1 = __importDefault(require("../../helpers/verifyToken"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const logPrefix = "[PROFILE:ADDPHONE:SERVICE]";
exports.default = ({ phone, country, token, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${logPrefix} init phone ${phone}, country ${country}`);
    const verifyTokenRes = yield (0, verifyToken_1.default)({ token, identifier: phone, type: "phone_verification" });
    if (!verifyTokenRes.status) {
        console.log(`${logPrefix} invalid token ===? `, phone);
        throw new AppError_1.default(verifyTokenRes.message, 400, logPrefix, {});
    }
    // check if phone exist
    const checkPhone = yield User_1.default.query()
        .findOne({ phone });
    if (checkPhone) {
        throw new AppError_1.default("Account already exist with this phone", 400, logPrefix, {});
    }
    // check if user has phone
    const checkUserPhone = yield User_1.default.query()
        .findOne({ id: userId });
    if (checkUserPhone) {
        if (checkUserPhone.phone_verified_at) {
            throw new AppError_1.default("Phone already added", 400, logPrefix, {});
        }
    }
    yield User_1.default.query().update({
        phone,
        country,
        phone_verified_at: new Date,
        updated_at: new Date
    }).where({
        id: userId
    });
    return { status: "success", statusCode: 200, data: {}, message: `Phone added successfully` };
});
//# sourceMappingURL=addPhone.js.map