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
const Refferal_1 = __importDefault(require("../../../models/Refferal"));
const logPrefix = "[USER:REFERREALS:CONTROLLER]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init ===> `, JSON.stringify(req.body));
        const user = req.user;
        const getRefferal = yield Refferal_1.default.query().where({ user_id: user.id }).withGraphFetched("user");
        let pNumber = 0;
        let pdNumber = 0;
        for (let index = 0; index < getRefferal.length; index++) {
            const element = getRefferal[index];
            if (getRefferal[index].status === "paid") {
                pdNumber = pdNumber + 1;
            }
            else if (getRefferal[index].status === "pending") {
                pNumber = pNumber + 1;
            }
        }
        const potentialPayout = pNumber * 100;
        const Payout = pdNumber * 100;
        return res.status(200).send({
            status: "success",
            data: { referral: getRefferal, potentialPayout, Payout },
            message: `Refferal fetch successfully`,
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map