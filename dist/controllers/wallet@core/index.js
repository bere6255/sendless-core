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
const procedure_1 = __importDefault(require("./procedure"));
// import funding from "../../services/wallet@core/funding";
exports.default = {
    procedure: (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, procedure_1.default)(req, res); }),
    test: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // const todaysDate = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        // const newReference = `tencoin_funding_${todaysDate}${randomNumber(11)}`;
        // const fundingRes = await funding({
        //     user_id: "6",
        //     peer_user_id: "1",
        //     user_phone:"2348062550673",
        //     meta: null,
        //     provider:"tencoin",
        //     user_email:"clement.bere@gmail.com",
        //     description: "this is a test funding of 25k that will be recalled",
        //     reference: newReference,
        //     amount: 1000,
        //     charge: 0,
        //     type: "funding",
        //     outward: false,
        //     uniqueKey: "13bd2435dw_gcenhjmsfgccc"
        // })
        // console.log(fundingRes)
        return res.status(200).send({ status: true, data: {}, message: "successful" });
    })
};
//# sourceMappingURL=index.js.map