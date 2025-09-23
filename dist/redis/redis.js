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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const asyncRedis = require("async-redis");
const redisMainUrl = process.env.REDIS_URL;
const redisMainPort = process.env.REDIS_PORT;
const redisMainPassword = process.env.REDIS_PASSWORD;
let clientMain;
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        clientMain = asyncRedis.createClient(redisMainPort, redisMainUrl);
        clientMain.auth(redisMainPassword, (err) => console.error("Main Redis PASSWORD : ERROR : ", err));
        clientMain.on("error", (err) => console.error("MAIN ERR : REDIS : ", err));
        return {
            clientMain,
        };
    }
    catch (e) {
        console.log(`Connection::::Redis error %s`, e.message);
    }
});
//# sourceMappingURL=redis.js.map