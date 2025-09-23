"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../controllers/auth"));
const isAuth_1 = __importDefault(require("../../middleware/isAuth"));
const auth = (0, express_1.Router)();
auth.post('/login', auth_1.default.login);
auth.get('/logout', isAuth_1.default, auth_1.default.logout);
auth.get('/countries', auth_1.default.countries);
auth.post('/register', auth_1.default.register);
auth.post('/reset-password-token', auth_1.default.restPasswordToken);
auth.post('/send-otp', auth_1.default.sendOTP);
auth.post('/reset-password', auth_1.default.postForgot);
exports.default = auth;
//# sourceMappingURL=index.js.map