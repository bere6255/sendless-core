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
const env = __importStar(require("dotenv"));
env.config();
const fincra_1 = __importDefault(require("../../configs/fincra"));
const FINCRA_BUSINES_ID = process.env.FINCRA_BUSINES_ID;
const logPrefix = "[THIRDPARTY:FINCRA:BVN]";
exports.default = ({ bvn }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(`${logPrefix} init ===> user:bvn ${bvn}`, JSON.stringify({ bvn }));
        const payload = {
            bvn: bvn,
            business: FINCRA_BUSINES_ID
        };
        const fincraRes = yield fincra_1.default.post("/core/bvn-verification", payload);
        return { status: true, data: (_a = fincraRes === null || fincraRes === void 0 ? void 0 : fincraRes.data) === null || _a === void 0 ? void 0 : _a.data, message: fincraRes.data.message };
    }
    catch (error) {
        let message = "Failed to queiry bvn, please try again in a few minutes";
        if (error.response) {
            if (error.response.data) {
                if (error.response.data.message) {
                    message = error.response.data.message;
                }
            }
        }
        console.log(`${logPrefix} error ===> `, error.message, error.stack);
        return { status: false, data: {}, message };
    }
});
//# sourceMappingURL=bvn.js.map