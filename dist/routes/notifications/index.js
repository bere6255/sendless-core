"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_1 = __importDefault(require("../../controllers/notifications"));
const isAuth_1 = __importDefault(require("../../middleware/isAuth"));
const notification = (0, express_1.Router)();
notification.use(isAuth_1.default);
notification.get('/', notifications_1.default.all);
exports.default = notification;
//# sourceMappingURL=index.js.map