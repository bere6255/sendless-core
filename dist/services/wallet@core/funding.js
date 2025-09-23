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
const mysql2_1 = __importDefault(require("mysql2"));
const objection_1 = require("objection");
const Transactions_1 = __importDefault(require("../../models/Transactions"));
const redisConnection_1 = __importDefault(require("../../redis/redisConnection"));
const generateRef_1 = __importDefault(require("../../utils/generateRef"));
const phoneMessage_1 = __importDefault(require("../../helpers/messages/phoneMessage"));
const VirtualAccounts_1 = __importDefault(require("../../models/VirtualAccounts"));
const logPrefix = "WALLET@CORE:FUNDING:SERVICE";
exports.default = ({ user_id, user_email, user_phone, peer_user_id, description, reference, walletType, amount, charge, type, outward, provider, meta, uniqueKey }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init ===>`, JSON.stringify({
            user_id,
            user_email,
            peer_user_id,
            walletType,
            amount,
            reference,
            provider,
            meta,
            type,
        }));
        if (amount <= 0) {
            return {
                status: false,
                data: {},
                message: "Amount most be above 100 ",
            };
        }
        const redisRes = yield (0, redisConnection_1.default)({
            type: "lock",
            key: `transaction:lock:${user_id}`,
            value: reference,
            time: 120
        });
        console.log(`${logPrefix} Redis lock response ===>`, redisRes, JSON.stringify({
            user_id,
            peer_user_id,
            walletType,
            amount,
            reference,
            type,
        }));
        if (!redisRes) {
            console.log(`${logPrefix} Redis lock ===> `, redisRes, JSON.stringify({
                user_id,
                peer_user_id,
                amount,
                walletType,
                reference,
                type,
            }));
            return {
                status: false,
                data: {},
                message: "processing user transation",
            };
        }
        const newReference = (0, generateRef_1.default)({ type });
        const sumuserTrans = yield Transactions_1.default.query()
            .select((0, objection_1.raw)("COALESCE(SUM(amount), 0)"))
            .where({ user_id, status: "successful" });
        console.log("sumuserTrans x sumPeeruserTrans===>", user_id, peer_user_id, sumuserTrans[0]["COALESCE(SUM(amount), 0)"]);
        const lastBalance = sumuserTrans[0]["COALESCE(SUM(amount), 0)"] || 0;
        const lastBalanceReceiver = 0;
        const query = `CALL createTransaction(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @addedTransaction, @newBalance, @lastBalance, @transactionType, @amount, @insertRowCount, @proceed);`;
        const params = [
            lastBalance,
            lastBalanceReceiver,
            uniqueKey,
            user_id,
            peer_user_id,
            amount,
            description,
            newReference,
            "successful",
            outward,
            walletType,
            type,
            provider,
            charge,
            reference,
            JSON.stringify(meta)
        ];
        const buildQuery = mysql2_1.default.format(query, params);
        let res = yield Transactions_1.default.knex().raw(buildQuery);
        yield (0, redisConnection_1.default)({
            type: "delete",
            key: `transaction:lock:${user_id}`,
            value: null,
            time: null
        });
        let transactionResp = Object.assign({}, res[0][0][0]);
        const addedTrans = transactionResp["@addedTransaction"];
        const newBalance = transactionResp["@newBalance"];
        if (addedTrans) {
            const getAccount = yield VirtualAccounts_1.default.query().findOne({ user_id });
            if (getAccount) {
                const phoneData = {
                    type: "Credit",
                    account: getAccount.account_number,
                    message: description.substr(0, 50),
                    amount: `₦${parseInt(`${amount / 100}`).toLocaleString("en-US")}`,
                    balance: `₦${parseInt(`${newBalance / 100}`).toLocaleString("en-US")}`
                };
                yield (0, phoneMessage_1.default)({
                    phone: user_phone,
                    type: "transaction",
                    meta: phoneData
                });
            }
        }
        return {
            status: true,
            data: Object.assign({}, res[0][0][0]),
            message: "processed transation successfully",
        };
    }
    catch (error) {
        yield (0, redisConnection_1.default)({
            type: "delete",
            key: `transaction:lock:${user_id}`,
            value: null,
            time: null
        });
        console.log(`${logPrefix} error ===> code: ${error.code}`, error.message, error.stack);
        if (error.code) {
            if (error.code === "ER_SP_DOES_NOT_EXIST") {
                console.log("ER_SP_DOES_NOT_EXIST", error);
                const finalError = {
                    status: false,
                    "@addedTransaction": 0,
                    "@insertRowCount": 0,
                    "@proceed": 0,
                    message: "please try again",
                };
                return finalError;
            }
            else if (error.code === "ER_DUP_ENTRY") {
                const finalError = {
                    status: true,
                    "@addedTransaction": 0,
                    "@insertRowCount": 0,
                    "@proceed": 0,
                    message: "duplicate entry",
                };
                return finalError;
            }
            else {
                const finalError = {
                    status: false,
                    "@addedTransaction": 0,
                    "@insertRowCount": 0,
                    "@proceed": 0,
                    message: "please try again",
                };
                return finalError;
            }
        }
    }
});
//# sourceMappingURL=funding.js.map