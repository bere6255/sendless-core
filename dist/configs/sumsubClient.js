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
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN;
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;
const SUMSUB_BASE_URL = 'https://api.sumsub.com';
const sumsubClient = axios_1.default.create({
    baseURL: SUMSUB_BASE_URL,
});
sumsubClient.interceptors.request.use((config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ts = Math.floor(Date.now() / 1000);
    const method = ((_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || 'GET';
    // ✅ Ensure we always sign only the path + query
    const urlObj = new URL(config.baseURL + (config.url || ''));
    const pathWithQuery = urlObj.pathname + urlObj.search;
    // ✅ Body string (must be exactly as sent)
    let bodyString = '';
    if (config.data && method !== 'GET') {
        // If explicitly null/undefined, leave empty string
        if (typeof config.data === 'string') {
            bodyString = config.data;
        }
        else if (Buffer.isBuffer(config.data)) {
            bodyString = config.data.toString();
        }
        else if (Object.keys(config.data).length > 0) {
            bodyString = JSON.stringify(config.data);
        }
    }
    // ✅ Compute HMAC
    const hmac = crypto_1.default.createHmac('sha256', SUMSUB_SECRET_KEY);
    hmac.update(String(ts) + method + pathWithQuery + bodyString);
    config.headers['X-App-Token'] = SUMSUB_APP_TOKEN;
    config.headers['X-App-Access-Ts'] = ts;
    config.headers['X-App-Access-Sig'] = hmac.digest('hex');
    return config;
}), (error) => Promise.reject(error));
exports.default = sumsubClient;
//# sourceMappingURL=sumsubClient.js.map