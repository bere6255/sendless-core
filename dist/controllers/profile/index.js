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
const getUser_1 = __importDefault(require("./getUser"));
const avatar_base_64_1 = __importDefault(require("./avatar_base_64"));
const changePassword_1 = __importDefault(require("./changePassword"));
const addPhone_1 = __importDefault(require("./addPhone"));
const address_1 = __importDefault(require("./address"));
const update_1 = __importDefault(require("./update"));
const verify_1 = __importDefault(require("./verify"));
const sumsub_1 = __importDefault(require("./sumsub"));
exports.default = {
    verify: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, verify_1.default)(req, res, next); }),
    sumsub: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, sumsub_1.default)(req, res, next); }),
    update: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, update_1.default)(req, res, next); }),
    address: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, address_1.default)(req, res, next); }),
    addPhone: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, addPhone_1.default)(req, res, next); }),
    getUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, getUser_1.default)(req, res, next); }),
    avatar_base_64: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, avatar_base_64_1.default)(req, res, next); }),
    changePassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, changePassword_1.default)(req, res, next); }),
};
//# sourceMappingURL=index.js.map