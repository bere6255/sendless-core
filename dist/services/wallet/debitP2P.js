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
const redisConnection_1 = __importDefault(require("../../redis/redisConnection"));
const debitWallet_1 = __importDefault(require("../wallet@core/debitWallet"));
const debit_1 = __importDefault(require("../wallet@core/debit"));
const logPrefix = "[WALLET:DEBITP2P:SERVICE]";
exports.default = ({ user_id, peer_user_id, description, reference, amount, wallet, charge, type, limit, meta }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log(`${logPrefix} init ===> `, JSON.stringify({
            user_id,
            peer_user_id,
            description,
            reference,
            wallet,
            amount,
            charge,
            type,
            meta
        }));
        if (user_id === peer_user_id) {
            console.log(`${logPrefix} user to self error ===>`, JSON.stringify({
                user_id,
                peer_user_id,
                description,
                reference,
                wallet,
                amount,
                charge,
                type
            }));
            return { status: false, data: {}, message: "You cannot send money to yourself" };
        }
        const lockKey = `p2p:${user_id}${peer_user_id}${amount}`;
        const lockValue = JSON.stringify({ user_id, peer_user_id, description, wallet, reference, amount });
        const lockTrans = yield (0, redisConnection_1.default)({
            type: "lock",
            key: lockKey,
            value: lockValue,
            time: 30
        });
        if (!lockTrans) {
            console.log(`${logPrefix} redis duplicate transaction ===>`, lockValue);
            return {
                status: false,
                data: {},
                message: "We are still processing your previous transaction"
            };
        }
        let finalDescription = description;
        if ((finalDescription === null || finalDescription === void 0 ? void 0 : finalDescription.length) >= 200) {
            finalDescription = finalDescription.substring(0, 200) + "...";
        }
        try {
            const debitWalletRes = yield (0, debitWallet_1.default)({ user_id, amount, wallet });
            if (!debitWalletRes.status) {
                console.log(`${logPrefix} debit wallet error ===>`, debitWalletRes.message, JSON.stringify({
                    user_id,
                    peer_user_id,
                    finalDescription,
                    reference,
                    amount,
                    meta
                }));
                return { status: false, data: {}, message: debitWalletRes.message };
            }
        }
        catch (error) {
            console.log(`${logPrefix} debit wallet catch error ===>`, error.message, (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message);
            return { status: false, data: {}, message: "Transaction Failed, Please try again" };
        }
        // Attempt to finalize debit transaction
        const debitPayload = {
            user_id,
            peer_user_id,
            description: finalDescription,
            reference,
            amount: amount * 100,
            charge,
            type,
            meta
        };
        console.log(`${logPrefix} debit payload ===>`, JSON.stringify(debitPayload));
        const debitRes = yield (0, debit_1.default)(debitPayload);
        console.log(`${logPrefix} debit response ===>`, debitRes.data);
        if (!debitRes.status) {
            console.log(`${logPrefix} debit transaction error ===>`, debitRes.message, JSON.stringify({
                user_id,
                peer_user_id,
                reference,
                amount
            }));
            return { status: false, data: {}, message: "Transaction Failed, Please try again" };
        }
        return { status: true, data: {}, message: "Processing transaction" };
    }
    catch (error) {
        console.log(`${logPrefix} catch error ===>`, error.message, error.stack);
        return { status: false, data: {}, message: "Transaction Failed, Please try again" };
    }
});
//# sourceMappingURL=debitP2P.js.map