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
const Token_1 = __importDefault(require("../models/Token"));
const logPrefix = "[VERIFY TOKEN]";
exports.default = ({ token, identifier, type }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init identifier: ${identifier}`);
        const getToken = yield Token_1.default.query().findOne({ token, type }).orderBy('created_at', 'desc');
        if (!getToken) {
            // blackist the number and email after four try 
            return { status: false, data: {}, message: "Invalid token" };
        }
        if (getToken.identifier !== identifier) {
            // blackist the number and email after four try 
            yield Token_1.default.query().where({ token, type }).delete();
            return { status: false, data: {}, message: "Invalid token" };
        }
        yield Token_1.default.query().where({ identifier }).delete();
        return { status: true, data: {}, message: "successful" };
    }
    catch (error) {
        console.log(`${logPrefix} Error ===> `, error.message, error.stack);
        return { status: false, data: {}, message: "Error verifying token" };
    }
});
//# sourceMappingURL=verifyToken.js.map