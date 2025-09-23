"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const env = __importStar(require("dotenv"));
env.config();
const transactions_1 = __importDefault(require("./transactions"));
const User_1 = __importDefault(require("../../models/User"));
// import VirtualAccounts from "../../models/VirtualAccounts";
const TENCOIN_COLLECTIONS = process.env.TENCOIN_COLLECTIONS;
const logPrefix = "[WALLET@CORE:DEBIT:SERVICE]";
exports.default = ({ user_id, peer_user_id, description, reference, amount, charge, type, meta }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init ===> `, JSON.stringify({
            user_id,
            peer_user_id,
            description,
            reference,
            amount,
            charge,
            type,
            meta
        }));
        if (user_id === peer_user_id) {
            console.log(`${logPrefix} same user account`, user_id, peer_user_id);
            return { status: false, data: {}, message: "You can not send money to your self" };
        }
        const checkSender = yield User_1.default.query().findOne({
            id: user_id
        });
        if (!checkSender) {
            console.log(`${logPrefix} Sender account not fund ===> `, JSON.stringify({
                user_id,
                peer_user_id,
                description,
                reference,
                amount,
                charge,
                type,
                meta
            }));
            return { status: false, data: {}, message: "Sender account not fund" };
        }
        const checkReciver = yield User_1.default.query().findOne({
            id: peer_user_id,
        });
        if (!checkReciver) {
            console.log(`${logPrefix} Reciver account not fund ===> `, JSON.stringify({
                user_id,
                peer_user_id,
                description,
                reference,
                amount,
                charge,
                type,
                meta
            }));
            return { status: false, data: {}, message: "Reciver account not fund" };
        }
        const tencoinCollectionAccount = yield User_1.default.query().findOne({
            id: TENCOIN_COLLECTIONS,
        });
        if (!tencoinCollectionAccount) {
            console.log(`${logPrefix} collection account error ===> `, JSON.stringify({
                user_id,
                peer_user_id,
                description,
                reference,
                amount,
                charge,
                type,
                meta
            }));
            return { status: false, data: {}, message: "Please try again in a few minutes" };
        }
        if (description) {
            if (description.length >= 240) {
                description = description.substr(0, 240) + "...";
            }
        }
        const outward = ["disburse", "withdrawal"].includes(type) ? true : false;
        // atempt to debit user
        const debitPayload = {
            uniqueKey: reference,
            user_id,
            peer_user_id,
            description,
            reference,
            amount: -amount,
            charge,
            type,
            outward,
            redisLock: true,
            meta
        };
        console.log(`${logPrefix} transaction payload ===> `, JSON.stringify(debitPayload));
        let transactionResp = yield (0, transactions_1.default)(debitPayload);
        console.log(`${logPrefix} transactionRes:::===> ${reference}`, JSON.stringify(transactionResp), "data ===> ", JSON.stringify({
            user_id,
            peer_user_id,
            description,
            reference,
            amount,
            charge,
            type,
            meta
        }));
        if (transactionResp.status === false) {
            return {
                status: false,
                data: {},
                message: transactionResp.message
            };
        }
        const addedTransaction = transactionResp["@addedTransaction"];
        const creditId = transactionResp["@creditId"];
        let newBalance = transactionResp["@newBalance"];
        if (addedTransaction === 2) {
            return {
                status: true,
                data: {},
                message: "Insufficient Funds"
            };
        }
        if ((charge > 0)) {
            let chargTransactionResp = yield (0, transactions_1.default)({
                uniqueKey: `charg_${reference}`,
                user_id,
                peer_user_id: tencoinCollectionAccount.id,
                description,
                reference: `charg_${reference}`,
                amount: -charge,
                charge,
                outward,
                type,
                redisLock: true,
                meta
            });
            console.log("ChargTransactionRes:::==> ", `charg_${reference}`, JSON.stringify(chargTransactionResp), "data ===> ", JSON.stringify({
                user_id,
                peer_user_id: tencoinCollectionAccount.id,
                description,
                reference: `charg_${reference}`,
                amount: -charge,
                charge,
                type,
                meta
            }));
            newBalance = chargTransactionResp["@newBalance"];
        }
        // date.format(now, 'YYYY/MM/DD HH:mm:ss');
        // handle transaction notification  
        const sendUser = ["withdrawal", "disburse", "reversal", "deposit"];
        const sendPeerUser = ["p2p"];
        // if (sendUser.includes(type)) {
        //   const getAccount = await VirtualAccounts.query().findOne({ user_id });
        //   if (getAccount) {
        //     if (description) {
        //       if (description.length > 50) {
        //         description = description.substr(0, 50);
        //       }
        //     }
        //     const phoneData = {
        //       type: "Debit",
        //       account: getAccount.account_number,
        //       message: description,
        //       amount: `₦${parseInt(`${amount / 100}`).toLocaleString("en-US")}`,
        //       balance: `₦${parseInt(`${newBalance / 100}`).toLocaleString("en-US")}`
        //     }
        //     await phoneMessage({
        //       phone: checkSender.phone,
        //       type: "transaction",
        //       meta: phoneData
        //     })
        //   }
        // }
        // if (sendPeerUser.includes(type)) {
        //   const emailPayload = {
        //     name: checkReciver?.firstName,
        //     reference,
        //     description,
        //     date: now,
        //     amount: `₦ ${parseInt(`${amount / 100}`).toLocaleString("en-US")}`
        //   }
        //   await emailMessage({
        //     email: checkReciver.email,
        //     type: "transaction",
        //     meta: emailPayload
        //   })
        // }
        return { status: true, data: {}, message: "Processing transation" };
    }
    catch (error) {
        console.log(`${logPrefix} error ===> `, error.message, error.stack);
        return { status: true, data: {}, message: "Processing transaction" };
    }
});
//# sourceMappingURL=debit.js.map