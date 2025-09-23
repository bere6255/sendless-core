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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const logPrefix = "[PIN:SETPIN:SERVICE]";
const saltRounds = process.env.SALT_ROUNDS || '10';
exports.default = ({ pin, user }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${logPrefix} init ===> user_id: ${user.email}`);
    const conPin = `${pin}`;
    const checkPin = yield Pin_1.default.query().findOne({ user_id: user.id });
    if (checkPin) {
        throw new AppError_1.default("You have already set your pin", 400, logPrefix, {});
    }
    const newPin = yield bcryptjs_1.default.hash(conPin.toString(), parseInt(saltRounds));
    yield Pin_1.default.query().insert({
        user_id: user.id,
        pin: newPin,
        pin_attempts: 0,
        reset_attempts: 0,
        created_at: new Date()
    });
    return { status: "success", statusCode: 200, data: {}, message: "Pin set successful" };
});
//# sourceMappingURL=setPing.js.map