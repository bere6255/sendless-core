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
const jimp_1 = __importDefault(require("jimp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logPrefix = "UTILS:IMAGE:FILEUPLOAD";
exports.default = ({ imageData, folder, filename, h = 100, v = 100 }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataArr = imageData.split(",");
        if (dataArr.includes("data:image/jpeg;base64") !== true &&
            dataArr.includes("data:image/png;base64") !== true) {
            console.log(`${logPrefix} type error`);
            return {
                message: "File must be of type jpg, jpeg or png",
                status: false,
            };
        }
        const dataType = dataArr[0].split("/");
        const fileType = dataType[1].split(";");
        const imageBuffer = Buffer.from(dataArr[1], "base64");
        const image = yield jimp_1.default.read(imageBuffer);
        // resize image
        yield image.resize(h, v);
        // make sure the folder exists
        const folderPath = path_1.default.join(process.cwd(), folder);
        if (!fs_1.default.existsSync(folderPath)) {
            fs_1.default.mkdirSync(folderPath, { recursive: true });
        }
        const destFileName = `${filename}.${fileType[0]}`;
        const outputPath = path_1.default.join(folderPath, destFileName);
        // save image
        yield image
            .resize(h, v)
            .quality(80)
            .writeAsync(outputPath.replace(/\.(png|jpeg|jpg)$/i, '.jpg'));
        return {
            status: true,
            data: {
                path: outputPath,
                filename: destFileName
            },
            message: "File uploaded successfully"
        };
    }
    catch (error) {
        console.log(`${logPrefix} error ==> `, error.message, error.stack);
        return {
            status: false,
            message: "Please try again shortly"
        };
    }
});
//# sourceMappingURL=imageUpload.js.map