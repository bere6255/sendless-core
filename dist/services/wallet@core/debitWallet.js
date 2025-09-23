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
/* eslint-disable camelcase */
require("dotenv").config();
const Wallet_1 = __importDefault(require("../../models/Wallet"));
const logPrefix = "[WALLET@CORE:DEBITWALLET:SERVICES]";
exports.default = ({ user_id, wallet, amount, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init ===> `, JSON.stringify({
            user_id,
            amount
        }));
        amount = amount * 100;
        const checkWallet = yield Wallet_1.default.query().findOne({ user_id, type: wallet });
        if (!checkWallet) {
            console.log(`${logPrefix} wallet not found ===> `, user_id);
            return {
                status: false,
                data: {},
                message: "Wallet not found",
            };
        }
        /** Attempt to debit sender */
        const balance = yield Wallet_1.default.query()
            .decrement("amount", amount)
            .where("amount", ">=", amount)
            .where({ id: checkWallet.id });
        if (balance === 0) {
            return {
                status: false,
                data: {},
                message: "Insufficient Funds",
            };
        }
        const newWalletBalance = yield Wallet_1.default.query().findOne({ id: checkWallet.id });
        console.log(`${logPrefix} balance ===> user_id: ${user_id} balance: ${newWalletBalance.amount}`);
        return {
            status: true,
            data: { user_id, balance: newWalletBalance.amount },
            message: "Debit process successfully",
        };
    }
    catch (error) {
        console.log(`${logPrefix} Error :::===> `, error.code, error.stack);
        return {
            status: false,
            data: {},
            message: "Unable to complete this trasnactions at the moment, kindly try again in a few minutes",
        };
    }
});
//# sourceMappingURL=debitWallet.js.map