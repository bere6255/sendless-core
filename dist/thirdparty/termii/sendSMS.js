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
const termii_1 = __importDefault(require("../../configs/termii"));
const TERMII_API_TOKEN = process.env.TERMII_API_TOKEN;
const logPrefix = "[THIRDPARTY:TERMII:SMS]";
exports.default = ({ body, to }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init ===> ${to}`);
        const smsRes = yield termii_1.default.post('/api/sms/send', {
            "to": `${to}`,
            "from": "N-Alert",
            "sms": `${body}`,
            "type": "plain",
            "channel": "dnd",
            "api_key": `${TERMII_API_TOKEN}`,
        });
        console.log(`${logPrefix} res ===>  ${to} `, JSON.stringify(smsRes.data));
        return true;
    }
    catch (error) {
        console.log(`${logPrefix} error ===> `, error.message, error.stack);
        return false;
    }
});
//# sourceMappingURL=sendSMS.js.map