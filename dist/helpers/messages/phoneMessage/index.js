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
const verification_1 = __importDefault(require("./messagess/verification"));
const sendSMS_1 = __importDefault(require("../../../thirdparty/termii/sendSMS"));
exports.default = ({ phone, type, meta }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let message = (0, verification_1.default)({ type, token: meta === null || meta === void 0 ? void 0 : meta.token });
        if (message) {
            yield (0, sendSMS_1.default)({ body: message, to: phone });
        }
        return true;
    }
    catch (error) {
        console.log("Phone notification Error ===> ", error.message, error.stack);
        return false;
    }
});
//# sourceMappingURL=index.js.map