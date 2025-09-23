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
const Token_1 = __importDefault(require("../../../models/Token"));
const validation_1 = __importDefault(require("./validation"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const logPrefix = "[USER:VERIFY:CONTROLLER]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Verify phone or email call ===> ", req.user.id);
        const user = req.user;
        const { errors, value } = yield (0, validation_1.default)(req.body);
        if (errors) {
            throw new AppError_1.default(errors[0], 400, logPrefix, errors);
        }
        const { token } = value;
        const checkToken = yield Token_1.default.query().findOne({ token });
        if (!checkToken) {
            throw new AppError_1.default('invalid verification token', 400, logPrefix, {});
        }
        const getUser = yield User_1.default.query().findOne({ email: checkToken.identifier }).orWhere({ phone: checkToken.identifier });
        if (!getUser) {
            throw new AppError_1.default('invalid verification token', 400, logPrefix, {});
        }
        if (getUser.id !== user.id) {
            throw new AppError_1.default('invalid verification token', 400, logPrefix, {});
        }
        if (checkToken.type === 'email') {
            yield User_1.default.query().findOne({ email: checkToken.identifier }).update({
                email_verified_at: new Date(),
                updated_at: new Date()
            });
        }
        else {
            yield User_1.default.query().findOne({ email: checkToken.identifier }).update({
                phone_verified_at: new Date(),
                updated_at: new Date()
            });
        }
        yield Token_1.default.query().deleteById(checkToken.id);
        console.log(`${checkToken.type} verification for ${checkToken.identifier}`);
        return res.status(200).send({
            status: "success",
            data: {},
            message: `${checkToken.type} verification was successful`,
        });
    }
    catch (error) {
        console.log("Verify Account Error ======>", error.message, error.stack);
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map