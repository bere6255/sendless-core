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
const verify_1 = __importDefault(require("./verify"));
const deleteAccount_1 = __importDefault(require("../users/deleteAccount"));
const createTag_1 = __importDefault(require("./createTag"));
const checkTag_1 = __importDefault(require("./checkTag"));
const referrals_1 = __importDefault(require("./referrals"));
exports.default = {
    verify: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, verify_1.default)(req, res, next); }),
    referrals: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, referrals_1.default)(req, res, next); }),
    createTag: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, createTag_1.default)(req, res, next); }),
    checkTag: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, checkTag_1.default)(req, res, next); }),
    deleteAccount: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, deleteAccount_1.default)(req, res, next); }),
};
//# sourceMappingURL=index.js.map