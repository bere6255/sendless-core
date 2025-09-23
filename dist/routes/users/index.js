"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("../../controllers/users"));
const isAuth_1 = __importDefault(require("../../middleware/isAuth"));
const verifyPin_1 = __importDefault(require("../../middleware/verifyPin"));
const user = (0, express_1.Router)();
user.use(isAuth_1.default);
user.post('/verify-email-phone', users_1.default.verify);
user.post('/create-tag', users_1.default.createTag);
user.get('/check-tag/:tag', users_1.default.checkTag);
user.get('/referrals', users_1.default.referrals);
user.post('/delete-account', verifyPin_1.default, users_1.default.deleteAccount);
exports.default = user;
//# sourceMappingURL=index.js.map