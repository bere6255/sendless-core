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
const User_1 = __importDefault(require("../../../models/User"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const logPrefix = "[P2P:NAMEENQUIRY:CONTROLLER]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        console.log(`${logPrefix} init user: ${user.phone} ===>`, JSON.stringify(req.body));
        const { errors, value } = yield (0, validation_1.default)(req.body);
        if (errors) {
            throw new AppError_1.default(errors[0], 400, logPrefix, errors);
        }
        const checkUserDetaild = yield User_1.default.query().findOne({ email: value.phoneTagEmail }).orWhere({ phone: value.phoneTagEmail }).orWhere({ tag: value.phoneTagEmail });
        if (!checkUserDetaild) {
            throw new AppError_1.default("Account not fount", 400, logPrefix, {});
        }
        return res.status(200).send({
            status: "success",
            data: {
                user: checkUserDetaild.userSimplified(),
            },
            message: "User details loaded successfully",
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map