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
require("dotenv").config();
const redisConnection_1 = __importDefault(require("../redis/redisConnection"));
const logPrefix = "[RATE:LIMIT:MID]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const clientId = req.headers['client-id'] || req.headers['user-agent'];
        console.log(`[${new Date().toISOString()}] ${logPrefix} ===>: Method: ${req.method} URL: ${req.originalUrl} IP: ${ip} Client-ID: ${clientId}`);
        const lockID = `ratelimit:${ip}:${clientId}:${req.method}:${req.originalUrl}`;
        // ===check suspiciuse ip
        const checkIp = yield (0, redisConnection_1.default)({ type: "get", key: `forbidden:${ip}:${clientId}`, value: null, time: null });
        if (checkIp) {
            return res.status(403).send('Forbidden');
        }
        // === Block suspicious paths ===
        const forbiddenPaths = [
            '/.git', '/.env', '/.env.testing', '/.env.production',
            '/wp-admin', '/wordpress', '/phpmyadmin'
        ];
        const requestUrl = req.url.toLowerCase();
        if (forbiddenPaths.some(path => requestUrl.startsWith(path))) {
            console.warn(`[${new Date().toISOString()} BLOCKED PATH] IP: ${req.ip} tried to access ${requestUrl}`);
            yield (0, redisConnection_1.default)({ type: "lock", key: `forbidden:${ip}:${clientId}`, value: lockID, time: 3000000000 });
            return res.status(403).send('Forbidden');
        }
        const checkRequest = yield (0, redisConnection_1.default)({ type: "get", key: lockID, value: null, time: null });
        if (checkRequest) {
            return res.status(429).json({ status: false, data: {}, message: 'Too many requests. Try again shortly.' });
        }
        yield (0, redisConnection_1.default)({ type: "lock", key: lockID, value: lockID, time: 10 });
        next();
    }
    catch (error) {
        console.log(`${logPrefix} error ===>`, error.message, error.stack);
        return res.status(401).send({
            status: false,
            data: {},
            message: "Try again shortly.",
        });
    }
});
//# sourceMappingURL=rateLimit.js.map