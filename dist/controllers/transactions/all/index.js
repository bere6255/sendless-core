"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const all_1 = __importDefault(require("../../../services/wallet/transactions/all"));
const logPrefix = "[WALLET:TRANSACTIONS:CONTROLLER]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        let page = '0';
        let limit = '20';
        let type = null;
        if (req.query.page) {
            page = req.query.page;
        }
        if (req.query.type) {
            if (req.query.type === "funding" || req.query.type === "disburse" || req.query.type === "transfer") {
                type = "main";
            }
            else {
                type = req.query.type;
            }
        }
        if (req.query.limit) {
            limit = req.query.limit;
        }
        console.log(`${logPrefix} init ===> User email ${user.email}`);
        const walletTransactions = yield (0, all_1.default)({ user, type, page, limit });
        return res.status(walletTransactions.status ? 200 : 400).send({
            status: walletTransactions.status,
            data: walletTransactions.data,
            message: walletTransactions.message,
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map