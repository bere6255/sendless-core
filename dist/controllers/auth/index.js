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
const login_1 = __importDefault(require("./login"));
const postForgot_1 = __importDefault(require("./postForgot"));
const restPasswordToken_1 = __importDefault(require("./restPasswordToken"));
const register_1 = __importDefault(require("./register"));
const sendOTP_1 = __importDefault(require("./sendOTP"));
const logout_1 = __importDefault(require("./logout"));
const countries_1 = __importDefault(require("./countries"));
exports.default = {
    login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, login_1.default)(req, res, next); }),
    logout: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, logout_1.default)(req, res, next); }),
    countries: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, countries_1.default)(req, res, next); }),
    postForgot: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, postForgot_1.default)(req, res, next); }),
    restPasswordToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, restPasswordToken_1.default)(req, res, next); }),
    register: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, register_1.default)(req, res, next); }),
    sendOTP: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, sendOTP_1.default)(req, res, next); }),
};
//# sourceMappingURL=index.js.map