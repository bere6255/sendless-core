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
const Transactions_1 = __importDefault(require("../../models/Transactions"));
const debit_1 = __importDefault(require("./debit"));
const logPrefix = "[REVERSE:TRANSACTION:SERVICE]";
exports.default = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init ===> reference:`, reference);
        // queue for 24h before runing tsq on the transaction then take action acodinly 
        const getTransaction = yield Transactions_1.default.query().where({ reference }).where("amount", "<", 0).first();
        if (!getTransaction) {
            console.log(`${logPrefix} not found error ===> reference:`, reference);
            return { status: false, data: {}, message: "Transaction not found" };
        }
        console.log(getTransaction);
        yield (0, debit_1.default)({
            user_id: getTransaction.peer_user_id,
            peer_user_id: getTransaction.user_id,
            amount: -getTransaction.amount,
            charge: getTransaction.charge,
            description: `Reversal ${getTransaction.description}`,
            reference: `reversal_${reference}`,
            type: "reversal",
            meta: getTransaction.meta
        });
        return { status: true, data: {}, message: "processing transaction" };
    }
    catch (error) {
        console.log(`${logPrefix} error ===> `, error.message, error.stack);
        return { status: false, data: {}, message: "Faild to process transaction" };
    }
});
//# sourceMappingURL=reverseTransaction.js.map