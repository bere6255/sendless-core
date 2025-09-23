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
exports.getNotification = exports.postNotification = void 0;
const redisConnection_1 = __importDefault(require("../redis/redisConnection"));
const logPrefix = "HELPERS:NOTIFICATION";
const postNotification = ({ userId, title, message, type, date }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init post`, JSON.stringify({ userId, title, message, type, date }));
        const key = `notification:${userId}`;
        let formartedData = [];
        const rawContent = yield (0, redisConnection_1.default)({ type: "get", key, value: "", time: null });
        if (rawContent) {
            formartedData = JSON.parse(rawContent);
        }
        formartedData.push({ title, message, type, date });
        yield (0, redisConnection_1.default)({ type: "set", key, value: JSON.stringify(formartedData), time: null });
        return { status: true, data: {}, message: "successful" };
    }
    catch (error) {
        console.log(`${logPrefix} Error ===> `, error.message, error.stack);
        return { status: false, data: {}, message: "Notification error, please try again" };
    }
});
exports.postNotification = postNotification;
const getNotification = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`${logPrefix} init get`, JSON.stringify({ userId }));
        const key = `notification:${userId}`;
        let formartedData = [];
        const rawContent = yield (0, redisConnection_1.default)({ type: "get", key, value: "", time: null });
        if (rawContent) {
            formartedData = JSON.parse(rawContent);
        }
        return { status: true, data: {}, message: "successful" };
    }
    catch (error) {
        console.log(`${logPrefix} Error ===> `, error.message, error.stack);
        return { status: false, data: {}, message: "Notification error, please try again" };
    }
});
exports.getNotification = getNotification;
//# sourceMappingURL=notifications.js.map