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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env = __importStar(require("dotenv"));
env.config();
const axios_1 = __importDefault(require("axios"));
const FINCRA_BASEURL = process.env.FINCRA_BASEURL;
const FINCRA_API_KEY = process.env.FINCRA_API_KEY;
const meTaInstance = axios_1.default.create({
    headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json',
        "api-key": FINCRA_API_KEY,
    },
    baseURL: FINCRA_BASEURL,
});
const post = meTaInstance.post;
const get = meTaInstance.get;
exports.default = { post, get };
//# sourceMappingURL=fincra.js.map