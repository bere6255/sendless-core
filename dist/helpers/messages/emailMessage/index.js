"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const env = __importStar(require("dotenv"));
env.config();
const nodeMail_1 = __importDefault(require("../../../configs/nodeMail"));
const token_1 = __importDefault(require("./messagess/token"));
const login_1 = __importDefault(require("./messagess/login"));
const changePassword_1 = __importDefault(require("./messagess/changePassword"));
exports.default = ({ email, type, meta }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const regex = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}");
        if (regex.test(email)) {
            let message;
            let subject;
            switch (type) {
                case "register":
                    message = (0, token_1.default)({ token: meta === null || meta === void 0 ? void 0 : meta.token });
                    subject = "Tencoin : Verification Token";
                    break;
                case "login":
                    message = (0, login_1.default)({ name: meta === null || meta === void 0 ? void 0 : meta.name, userAgent: meta.userAgent });
                    subject = `Tencoin : Security alert login`;
                    break;
                case "chagePassword":
                    message = (0, changePassword_1.default)({ name: meta === null || meta === void 0 ? void 0 : meta.name });
                    subject = `Tencoin : Security alert password change}`;
                    break;
                default:
                    break;
            }
            if (email && subject && message) {
                yield (0, nodeMail_1.default)({ to: email, subject, message });
            }
        }
        return true;
    }
    catch (error) {
        console.log("Email notification Error ===> ", error.message, error.stack);
        return false;
    }
});
//# sourceMappingURL=index.js.map