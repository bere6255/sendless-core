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
const logPrefix = "USER:DELETE_ACCOUNT:CONTROLLER";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Delete Account call ===> ", JSON.stringify(req.body));
        const user = req.user;
        // Soft Delete
        yield User_1.default.query().findOne({ id: user.id }).update({
            deleted_at: new Date
        });
        return res.status(200).send({
            status: true,
            data: {},
            message: `We miss you, hope you come back`,
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map