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
const validation_1 = __importDefault(require("./validation"));
const resetPasswordToken_1 = __importDefault(require("../../../services/auth/resetPasswordToken"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const logPrefix = "[AUTH:RESETPASSWORDTOKEN:CONTROLLER]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} Init ===> `, JSON.stringify(Object.assign({}, req.body)));
        const { errors, value } = yield (0, validation_1.default)(req.body);
        if (errors) {
            throw new AppError_1.default(errors[0], 400, logPrefix, errors);
        }
        // Send reset phone token to provided phone
        const { status, statusCode, message, data } = yield (0, resetPasswordToken_1.default)({ phone: value.emailPhone });
        return res.status(statusCode).send({
            status,
            data,
            message
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map