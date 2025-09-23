"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const p2p_1 = __importDefault(require("../../controllers/p2p"));
const isAuth_1 = __importDefault(require("../../middleware/isAuth"));
const verifyPin_1 = __importDefault(require("../../middleware/verifyPin"));
const p2p = (0, express_1.Router)();
p2p.use(isAuth_1.default);
p2p.post('/', verifyPin_1.default, p2p_1.default.send);
p2p.post('/name-enquiry', p2p_1.default.nameEnquiry);
exports.default = p2p;
//# sourceMappingURL=index.js.map