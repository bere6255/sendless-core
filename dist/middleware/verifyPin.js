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
require("dotenv").config();
const Pin_1 = __importDefault(require("../models/Pin"));
const User_1 = __importDefault(require("../models/User"));
const Bans_1 = __importDefault(require("../models/Bans"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const logPrefix = "[MIDDLEWARE:VERIFYPIN]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        // checking if auth header contains token
        if (!req.body || !req.body.transactionPin) {
            throw new AppError_1.default("Authorization pin not found", 406, logPrefix, {});
        }
        const getPin = yield Pin_1.default.query().findOne({ user_id: user.id });
        if (!getPin) {
            throw new AppError_1.default("Please set authorization pin to complate this request", 406, logPrefix, {});
        }
        const validated = yield bcryptjs_1.default.compare(req.body.transactionPin, getPin.pin);
        let attempt = 0;
        attempt = !getPin.pin_attempts ? 0 : parseInt(getPin.pin_attempts);
        if (validated === false) {
            // ban user for multiple pin attempt error
            if (attempt < 3) {
                attempt = attempt + 1;
                yield Pin_1.default.query().findOne("user_id", "=", user.id).update({
                    pin_attempts: attempt,
                });
            }
            if (attempt >= 3) {
                yield User_1.default.query()
                    .patch({ banned_at: new Date() })
                    .where("id", "=", user.id);
                yield Bans_1.default.query().insert({
                    user_id: user.id,
                    comment: "banned for exceeding pin retry limit",
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                throw new AppError_1.default("banned for exceeding pin retry limit", 406, logPrefix, {});
            }
            throw new AppError_1.default(`Incorrect pin, ${5 - attempt} attempts left, please try again`, 406, logPrefix, {});
        }
        if (attempt >= 3) {
            throw new AppError_1.default("banned for exceeding pin retry limit", 406, logPrefix, {});
        }
        yield Pin_1.default.query().findOne("user_id", "=", user.id).update({
            pin_attempts: 0,
        });
        req.body.transactionPin = null;
        next();
    }
    catch (error) {
        throw new AppError_1.default("Unauthorized, login", 401, logPrefix, {});
    }
});
//# sourceMappingURL=verifyPin.js.map