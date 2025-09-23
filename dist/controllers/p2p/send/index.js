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
const User_1 = __importDefault(require("../../../models/User"));
const validation_1 = __importDefault(require("./validation"));
const debitP2P_1 = __importDefault(require("../../../services/wallet/debitP2P"));
const generateRef_1 = __importDefault(require("../../../utils/generateRef"));
const redisConnection_1 = __importDefault(require("../../../redis/redisConnection"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const logPrefix = "[P2P:SEND:CONTROLLER]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        console.log(`${logPrefix} init ===> `, JSON.stringify({
            user: { id: user.id, email: user.email, phone: user.phone },
            payload: Object.assign(Object.assign({}, req.body), { transactionPin: null })
        }));
        const { errors, value } = yield (0, validation_1.default)(req.body);
        if (errors) {
            throw new AppError_1.default(errors[0], 400, logPrefix, errors);
        }
        let { wallet, usernames, amount, description, meta } = value;
        // Check Redis config for transfer availability
        let transferStatus = yield (0, redisConnection_1.default)({ type: "get", key: "p2p", value: null, time: null });
        if (transferStatus) {
            transferStatus = JSON.parse(transferStatus);
            if (!transferStatus.transfer) {
                throw new AppError_1.default("Transfers are currently not available, please try again in a few minutes", 400, logPrefix, {});
            }
        }
        // Check if any of the usernames (email, phone, tag) exist
        const checkUserDetaild = yield User_1.default.query()
            .select("id")
            .where(builder => builder
            .whereIn("email", usernames)
            .orWhereIn("phone", usernames)
            .orWhereIn("tag", usernames));
        if (checkUserDetaild.length === 0) {
            throw new AppError_1.default("Account not found", 400, logPrefix, {});
        }
        // Get array of IDs from matched users
        const userIds = checkUserDetaild.map(u => u.id);
        // Process each peer transfer
        for (let peerUserId of userIds) {
            const payload = {
                user_id: user.id,
                peer_user_id: peerUserId,
                description,
                reference: (0, generateRef_1.default)({ type: "p2p" }),
                amount,
                limit: parseInt(user.limit),
                charge: 0,
                type: "p2p",
                wallet,
                meta
            };
            const debitPayload = yield (0, debitP2P_1.default)(payload);
            console.log(`${logPrefix} send Response ===> `, JSON.stringify(debitPayload));
            if (debitPayload.status === false) {
                return res.status(400).send(debitPayload);
            }
        }
        // Success response
        return res.status(200).send({
            status: true,
            data: {},
            message: "Processing transaction"
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map