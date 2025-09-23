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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redisConnection_1 = __importDefault(require("../redis/redisConnection"));
const getUser_1 = __importDefault(require("../services/profile/getUser"));
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const logPrefix = "[MIDDLEWARE:ISAUTH]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // checking if auth header contains token
        if (!req.headers || !req.headers.authorization) {
            return res.status(401).send({
                status: false,
                data: {},
                message: "no authorization header found",
            });
        }
        // getting authorization header
        const bearerHeader = req.headers.authorization;
        // splitting bearer
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        const verify = jsonwebtoken_1.default.verify(bearerToken, ENCRYPTION_KEY);
        // check if user exist
        const jwtPayload = verify;
        if (!jwtPayload.exp) {
            return res.status(401).send({
                status: false,
                data: {},
                message: "Unauthorized login",
            });
        }
        // check if token is black listed
        const checkBlackList = yield (0, redisConnection_1.default)({ type: "get", key: `blackList:${bearerToken}`, value: null, time: null });
        if (checkBlackList) {
            return res.status(401).send({
                status: false,
                data: {},
                message: "Unauthorized login",
            });
        }
        let user;
        // get user from redis
        const getRedisUser = yield (0, redisConnection_1.default)({ type: "get", key: `users:${jwtPayload.id}`, value: null, time: null });
        if (getRedisUser) {
            user = JSON.parse(getRedisUser);
        }
        else {
            const userDetails = yield (0, getUser_1.default)({ userId: jwtPayload.id });
            user = (_a = userDetails === null || userDetails === void 0 ? void 0 : userDetails.data) === null || _a === void 0 ? void 0 : _a.user;
        }
        if (user.banned_at) {
            return res.status(401).send({
                status: false,
                data: {},
                message: "Account banned please contact support",
            });
        }
        req.token = bearerToken;
        req.user = user;
        next();
    }
    catch (error) {
        console.log(`${logPrefix} error ===> `, error.message, error.stack);
        return res.status(401).send({
            status: " fail",
            data: {},
            message: "Unauthorized, login"
        });
    }
});
//# sourceMappingURL=isAuth.js.map