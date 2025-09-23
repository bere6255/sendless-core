"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_1 = __importDefault(require("../../controllers/profile"));
const isAuth_1 = __importDefault(require("../../middleware/isAuth"));
const profile = (0, express_1.Router)();
profile.use(isAuth_1.default);
profile.get('/', profile_1.default.getUser);
profile.post('/update', profile_1.default.update);
profile.post('/verify', profile_1.default.verify);
profile.post('/add-phone', profile_1.default.addPhone);
profile.get('/sumsub', profile_1.default.sumsub);
profile.post('/address', profile_1.default.address);
profile.post('/update-avater', profile_1.default.avatar_base_64);
profile.post('/change-password', profile_1.default.changePassword);
exports.default = profile;
//# sourceMappingURL=index.js.map