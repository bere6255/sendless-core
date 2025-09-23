"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const axios_1 = __importDefault(require("axios"));
const TERMII_BASE_URL = process.env.TERMII_BASE_URL;
const TwilioInstance = axios_1.default.create({
    headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
    },
    baseURL: `${TERMII_BASE_URL}`,
});
const post = TwilioInstance.post;
const get = TwilioInstance.get;
exports.default = { post, get };
//# sourceMappingURL=termii.js.map