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
const logPrefix = "[WALLET:SINGLETRANACTIONS:SERVICE]";
exports.default = ({ user, reference }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = user.id;
        if (!user_id || !reference) {
            console.log(`${logPrefix} user id or reference not found ===> `, user_id);
            return { status: false, statusCode: 400, data: {}, message: "User id or reference is required" };
        }
        const userTransactions = yield Transactions_1.default.query().findOne({ user_id, reference });
        if (!userTransactions) {
            console.log(`${logPrefix} transaction not found reference ${reference}`);
            return { status: false, statusCode: 400, data: {}, message: "Transaction not found" };
        }
        const loadedPeeUsers = yield User_1.default.query().select("id", "firstName", "lastName", "avatar").findOne({ id: userTransactions.peer_user_id });
        if (!loadedPeeUsers) {
            console.log(`${logPrefix} Peer user not found reference ${reference}`);
            return { status: false, statusCode: 400, data: {}, message: "Transaction not found" };
        }
        const sortedTransaction = Object.assign(Object.assign({}, userTransactions), { amount: userTransactions.amount / 100, created_at: date_and_time_1.default.format(userTransactions.created_at, 'YYYY/MM/DD HH:mm:ss'), updated_at: date_and_time_1.default.format(userTransactions.created_at, 'YYYY/MM/DD HH:mm:ss'), peeUser: loadedPeeUsers, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar } });
        return {
            statusCode: 200,
            status: true,
            data: sortedTransaction,
            message: `Transactions fetch successfully`,
        };
    }
    catch (error) {
        console.log(`${logPrefix} Fetch transaction Error ======>`, error.message, error.stack);
        return {
            statusCode: 401,
            status: false,
            data: {},
            message: "Failed get fetch transaction, please try again in a few minutes"
        };
    }
});
//# sourceMappingURL=single.js.map