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
const Address_1 = __importDefault(require("../../models/Address"));
const redisConnection_1 = __importDefault(require("../../redis/redisConnection"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const logPrefix = "[PROFILE:ADDRESS:SERVICE]";
exports.default = ({ address, city, state, country, user }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${logPrefix} init user ${user.phone}, data ${JSON.stringify({ address, city, state })}`);
    const checkNextkin = yield Address_1.default.query().findOne({ user_id: user.id });
    if (checkNextkin) {
        throw new AppError_1.default("address already added", 400, logPrefix, {});
    }
    yield Address_1.default.query().insert({
        user_id: user.id,
        address,
        country,
        city,
        state,
        created_at: new Date(),
        updated_at: new Date()
    });
    yield (0, redisConnection_1.default)({ type: "delete", key: `users:${user.id}`, value: null, time: null });
    return { status: "success", statusCode: 200, data: {}, message: `Address added successfully` };
});
//# sourceMappingURL=address.js.map