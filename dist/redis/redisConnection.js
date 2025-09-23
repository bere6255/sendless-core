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
/* eslint-disable camelcase */
require("dotenv").config();
const redis_1 = __importDefault(require("./redis"));
exports.default = ({ type, key, value, time = 300 }) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, redis_1.default)().then(({ clientMain }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            switch (type) {
                case "get":
                    return yield clientMain.get(key);
                case "set":
                    return yield clientMain.set(key, value);
                case "lock":
                    return yield clientMain.set(key, value, "NX", `EX`, time);
                case "delete":
                    return yield clientMain.del(key);
                default:
                    return null;
            }
        }
        catch (e) {
            console.log(`Retry error %s`, e.message);
            return null;
        }
    }));
});
//# sourceMappingURL=redisConnection.js.map