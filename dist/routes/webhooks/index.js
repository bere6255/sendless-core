"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhooks_1 = __importDefault(require("../../controllers/webhooks"));
const webhooks = (0, express_1.Router)();
webhooks.post('/fincra', webhooks_1.default.fincra);
exports.default = webhooks;
//# sourceMappingURL=index.js.map