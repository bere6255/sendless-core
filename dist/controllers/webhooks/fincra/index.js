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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const User_1 = __importDefault(require("../../../models/User"));
const VirtualAccounts_1 = __importDefault(require("../../../models/VirtualAccounts"));
const funding_1 = __importDefault(require("../../../services/wallet@core/funding"));
const crypto_1 = __importDefault(require("crypto"));
const FINCRA_SECRET_KEY = process.env.FINCRA_SECRET_KEY || "";
const logPrefix = "WEBHOOK:FINCRA:CONTROLLER";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init ===> body: `, JSON.stringify(req.body));
        const encryptedData = crypto_1.default
            .createHmac("SHA512", FINCRA_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest("hex");
        const signatureFromWebhook = req.headers['signature'];
        if (encryptedData !== signatureFromWebhook) {
            console.log(`${logPrefix} invalid signature ===> `, JSON.stringify(req.body));
            return res.status(200).send({
                status: "success",
                data: {},
                message: "successfull ",
            });
        }
        const { event, data } = req.body;
        if (event === "collection.successful") {
            const userAccount = yield VirtualAccounts_1.default.query().where({ account_number: data.virtualAccount });
            if (userAccount.length === 0) {
                console.log(`${logPrefix} account not found ===> `, JSON.stringify(req.body));
                return res.status(400).send({
                    status: "fail",
                    data: {},
                    message: "Account not found ",
                });
            }
            if (userAccount.length > 1) {
                console.log(`${logPrefix} duplecate account ===> `, JSON.stringify(req.body));
                return res.status(400).send({
                    status: "fail",
                    data: {},
                    message: "Account not found ",
                });
            }
            const user = yield User_1.default.query().findOne({ id: userAccount[0].user_id });
            if (!user) {
                console.log(`${logPrefix} users account ===> `, JSON.stringify(req.body));
                return res.status(400).send({
                    status: "fail",
                    data: {},
                    message: "Account not found ",
                });
            }
            yield (0, funding_1.default)({
                user_id: user.id,
                peer_user_id: "4",
                user_phone: user.phone,
                meta: data,
                provider: "fincra",
                user_email: user === null || user === void 0 ? void 0 : user.email,
                walletType: "NGN",
                description: data.description,
                reference: data.reference,
                amount: data.amountReceived * 100,
                charge: 0,
                type: "funding",
                outward: false,
                uniqueKey: data.sessionId
            });
        }
        return res.status(200).send({
            status: "success",
            data: {},
            message: "successfull ",
        });
    }
    catch (error) {
        // Centralized error handling
        error.logPrefix = logPrefix;
        next(error); // Pass the error to the Express error handling middleware
    }
});
//# sourceMappingURL=index.js.map