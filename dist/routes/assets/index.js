"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assets_1 = __importDefault(require("../../controllers/assets"));
const assets = (0, express_1.Router)();
// assets.use(isAuth)
assets.get('/', assets_1.default.get);
exports.default = assets;
//# sourceMappingURL=index.js.map