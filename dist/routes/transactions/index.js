"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactions_1 = __importDefault(require("../../controllers/transactions"));
const isAuth_1 = __importDefault(require("../../middleware/isAuth"));
const transactions = (0, express_1.Router)();
transactions.use(isAuth_1.default);
transactions.get('/', transactions_1.default.allTransaction);
transactions.get('/:reference', transactions_1.default.single);
exports.default = transactions;
//# sourceMappingURL=index.js.map