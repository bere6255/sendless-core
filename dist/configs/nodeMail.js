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
const nodemailer_1 = __importDefault(require("nodemailer"));
const EMAIL_HOST = process.env.EMAIL_HOST || '1234';
const EMAIL_USER = process.env.EMAIL_USER || '1234';
const EMAIL_PASS = process.env.EMAIL_PASS || '1234';
const EMAIL_FROM = process.env.EMAIL_FROM;
exports.default = ({ to, subject, message }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer_1.default.createTransport({
            host: EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS, // generated ethereal password
            },
        });
        console.log("Message sent: %s To", to, subject);
        // send mail with defined transport object
        let info = yield transporter.sendMail({
            from: EMAIL_FROM,
            to,
            subject,
            html: message, // html body
        });
        console.log("Message sent: %s", info);
        return true;
    }
    catch (error) {
        console.log(error);
        console.log("email sending error ===> ", error.message, error.stack);
        return false;
    }
});
//# sourceMappingURL=nodeMail.js.map