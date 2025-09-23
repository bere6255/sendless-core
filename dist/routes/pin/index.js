"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pin_1 = __importDefault(require("../../controllers/pin"));
const isAuth_1 = __importDefault(require("../../middleware/isAuth"));
const pin = (0, express_1.Router)();
pin.use(isAuth_1.default);
pin.post('/set-pin', pin_1.default.setPin);
pin.post('/update', pin_1.default.updatePin);
pin.get('/get-token', pin_1.default.sendPinOTPP);
exports.default = pin;
//# sourceMappingURL=index.js.map