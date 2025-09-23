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
const login_1 = __importDefault(require("../../../services/auth/login"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const logPrefix = "[AUTH:LOGIN:CONTROLLER]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init ===> `, JSON.stringify(Object.assign(Object.assign({}, req.body), { password: null, reCapToken: null })));
        const { errors, value } = yield (0, validation_1.default)(req.body);
        if (errors) {
            throw new AppError_1.default(errors[0], 400, logPrefix, errors);
        }
        const result = yield (0, login_1.default)(Object.assign(Object.assign({}, value), { userAgent: req.headers["user-agent"], logPrefix }));
        return res.status(result.statusCode).send({
            status: result.status,
            data: result.data,
            message: result.message,
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map