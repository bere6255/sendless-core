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
const v1_1 = __importDefault(require("../../services/wallet@core/procedures/v1"));
const logPrefix = "[Procedure Countroller]";
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} call ===> `, JSON.stringify(req.body));
        const procedureRes = yield (0, v1_1.default)();
        return res.status(200).send({
            status: true,
            data: procedureRes,
            message: "successful",
        });
    }
    catch (error) {
        console.log(`${logPrefix} Error ======>`, error.message, error.stack);
        return res.status(400).send({
            status: false,
            data: {},
            message: "Failed, please try again in a few minutes"
        });
    }
});
//# sourceMappingURL=procedure.js.map