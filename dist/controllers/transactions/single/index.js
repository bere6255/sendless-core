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
const single_1 = __importDefault(require("../../../services/wallet/transactions/single"));
const logPrefix = "[WALLET:TRANSACTIONSDETAILS:CONTROLLER]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { reference } = req.params;
        console.log(`${logPrefix} init ===> User_id ${user.id} reference: ${reference}`);
        const walletTransactions = yield (0, single_1.default)({ user, reference });
        return res.status(walletTransactions.statusCode).send({
            status: walletTransactions.status,
            data: (walletTransactions === null || walletTransactions === void 0 ? void 0 : walletTransactions.data) || {},
            message: walletTransactions.message,
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map