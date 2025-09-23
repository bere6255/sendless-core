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
const objection_1 = require("objection");
const Wallet_1 = __importDefault(require("../../models/Wallet"));
const Refferal_1 = __importDefault(require("../../models/Refferal"));
const generateJWT_1 = __importDefault(require("../../helpers/generateJWT"));
// import emailMessage from "../../helpers/messages/emailMessage";
const getUser_1 = __importDefault(require("../profile/getUser"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const saltRounds = process.env.SALT_ROUNDS || "10";
const logPrefix = "[AUTH:REGISTER:SERVICE]";
exports.default = ({ fullName, refCode, email, phone, password }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${logPrefix} init ===> `, JSON.stringify({ email, phone, fullName }));
    const userPhone = yield User_1.default.query()
        .findOne({ phone }).orWhere({ email });
    if (userPhone) {
        throw new AppError_1.default("You already have an account with this email, please login", 400, logPrefix, {});
    }
    let passwordHash = null;
    if (password) {
        passwordHash = yield bcryptjs_1.default.hash(password, parseInt(saltRounds));
    }
    let newUser = null;
    try {
        yield (0, objection_1.transaction)(User_1.default, Wallet_1.default, (User) => __awaiter(void 0, void 0, void 0, function* () {
            const newUserData = {
                phone,
                email,
                full_name: fullName,
                password: passwordHash,
                email_verified_at: new Date(),
                phone_verified_at: new Date(),
                notification: 1,
                created_at: new Date(),
                updated_at: new Date(),
            };
            newUser = yield User.query().insertAndFetch(newUserData);
        }));
    }
    catch (error) {
        console.log(error);
        throw new AppError_1.default("Registration error, kindly try again in a few minutes", 400, logPrefix, {});
    }
    if (!newUser) {
        throw new AppError_1.default("Registration error, kindly try again in a few minutes", 400, logPrefix, {});
    }
    const token = (0, generateJWT_1.default)(newUser.id);
    const theUser = yield User_1.default.query()
        .findById(newUser.id);
    // work on refCode section
    if (refCode) {
        const refUser = yield User_1.default.query().findOne({ tag: refCode });
        if (refUser) {
            yield Refferal_1.default.query().insert({
                user_id: refUser.id,
                peer_user_id: theUser === null || theUser === void 0 ? void 0 : theUser.id,
                status: "pending",
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
    }
    if (theUser) {
        const userProfile = yield (0, getUser_1.default)({ userId: theUser.id });
        // await emailMessage({ email: theUser.email, type: "welcome", meta: { name: firstName } });
        return {
            status: "success",
            statusCode: 200,
            data: Object.assign({ token }, userProfile.data),
            message: "Registration successful "
        };
    }
    return { status: false, statusCode: 400, data: {}, message: "Registration unsuccessful, kindly try again in a few minutes" };
});
//# sourceMappingURL=register.js.map