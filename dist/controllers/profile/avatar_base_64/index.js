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
const uuid_1 = require("uuid");
const User_1 = __importDefault(require("../../../models/User"));
const validation_1 = __importDefault(require("./validation"));
const imageUpload_1 = __importDefault(require("../../../utils/imageUpload"));
const redisConnection_1 = __importDefault(require("../../../redis/redisConnection"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const APP_URL = process.env.APP_URL;
const logPrefix = "PROFILE:AVATER";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { errors, value } = yield (0, validation_1.default)(req.body);
        if (errors) {
            throw new AppError_1.default(errors[0], 400, logPrefix, errors);
        }
        const { image } = value;
        const userId = req.user.id;
        const user = yield User_1.default.query().findOne({
            id: userId,
        });
        if (!user) {
            throw new AppError_1.default("User does not exist", 400, logPrefix, {});
        }
        const dataArr = image.split(",");
        if (dataArr.includes("data:image/jpeg;base64") !== true &&
            dataArr.includes("data:image/png;base64") !== true) {
            throw new AppError_1.default("File must be of type jpg, jpeg", 400, logPrefix, {});
        }
        const filename = `${(0, uuid_1.v4)()}`;
        const folder = "public/profile";
        const avatar = `/${folder}/${filename}.jpg}`;
        const avatar2 = `/${folder}/${filename}_600.jpg}`;
        yield (0, imageUpload_1.default)({ imageData: image, folder, filename, h: 100, v: 100 });
        yield (0, imageUpload_1.default)({ imageData: image, folder, filename: `${filename}_600`, h: 600, v: 600 });
        yield User_1.default.query()
            .where({
            id: userId,
        })
            .update({
            avatar: JSON.stringify([avatar, avatar2]),
            updated_at: new Date(),
        })
            .catch((error) => {
            throw new AppError_1.default("Failed to upload avatar - please try again later", 400, logPrefix, {});
        });
        yield (0, redisConnection_1.default)({ type: "delete", key: `users:${userId}`, value: null, time: null });
        return res.status(201).send({
            message: "Avatar updated successfully",
            data: { avatar: [`${APP_URL}${avatar}`, `${APP_URL}${avatar2}`] },
            status: "success",
        });
    }
    catch (error) {
        error.logPrefix = logPrefix;
        next(error);
    }
});
//# sourceMappingURL=index.js.map