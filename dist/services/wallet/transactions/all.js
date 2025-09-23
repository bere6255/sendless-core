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
const Transactions_1 = __importDefault(require("../../../models/Transactions"));
const User_1 = __importDefault(require("../../../models/User"));
const date_and_time_1 = __importDefault(require("date-and-time"));
const logPrefix = "[WALLET:TRANACTIONS:SERVICE]";
exports.default = ({ user, type, page, limit = 10 }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = user.id;
        if (!user_id) {
            console.log(`${logPrefix} user or asset id not found ===> `, user_id, type, page, limit);
            return { status: false, data: {}, message: "Wallet or asset id is required" };
        }
        const sortedTransaction = [];
        const peerUserIds = [];
        let userTransactions = [];
        if (!type) {
            userTransactions = yield Transactions_1.default.query().where({ user_id, status: "successful" }).page(page, limit);
        }
        else {
            userTransactions = yield Transactions_1.default.query().where({ user_id, status: "successful", type }).page(page, limit);
        }
        if (userTransactions.results.length > 0) {
            for (let index = 0; index < userTransactions.results.length; index++) {
                peerUserIds.push(userTransactions.results[index].peer_user_id);
            }
        }
        const loadedPeeUsers = yield User_1.default.query().select("id", "full_name", "avatar").whereIn("id", peerUserIds);
        if (loadedPeeUsers.length > 0) {
            for (let transindex = 0; transindex < userTransactions.results.length; transindex++) {
                const singleTrans = userTransactions.results[transindex];
                for (let userindex = 0; userindex < loadedPeeUsers.length; userindex++) {
                    const userDetails = loadedPeeUsers[userindex];
                    if (singleTrans.peer_user_id === userDetails.id) {
                        delete singleTrans.balance;
                        sortedTransaction.push(Object.assign(Object.assign({}, singleTrans), { amount: singleTrans.amount / 100, created_at: date_and_time_1.default.format(singleTrans.created_at, 'YYYY/MM/DD HH:mm:ss'), updated_at: date_and_time_1.default.format(singleTrans.created_at, 'YYYY/MM/DD HH:mm:ss'), peeUser: userDetails, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar } }));
                    }
                }
            }
        }
        const totalRecords = userTransactions.total;
        const currentPage = page;
        const nextPage = page + 1;
        let previousPage = 0;
        if (page - 1 >= 0) {
            previousPage = page - 1;
        }
        return {
            status: true,
            data: { currentPage, nextPage, results: sortedTransaction.reverse(), totalRecords, limit, previousPage },
            message: `Transactions fetch successfully`,
        };
    }
    catch (error) {
        console.log(`${logPrefix} Fetch transaction Error ======>`, error.message, error.stack);
        return {
            status: false,
            data: {},
            message: "Failed get fetch transaction, please try again in a few minutes",
            errors: [],
        };
    }
});
//# sourceMappingURL=all.js.map