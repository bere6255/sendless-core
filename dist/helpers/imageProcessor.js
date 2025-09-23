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
exports.processAndConvertImage = void 0;
const jimp_1 = __importDefault(require("jimp"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const ABSOLUTE_UPLOADS_DIR = path_1.default.join(process.cwd(), 'public', 'docs');
const RELATIVE_UPLOADS_BASE_PATH = path_1.default.join('public', 'docs');
if (!fs_1.default.existsSync(ABSOLUTE_UPLOADS_DIR)) {
    fs_1.default.mkdirSync(ABSOLUTE_UPLOADS_DIR, { recursive: true });
}
/**
 * Processes a base64 encoded image:
 * 1. Reads the image from its base64 string.
 * 2. Resizes it to fit within specified maximum dimensions (default 640x640) while maintaining aspect ratio.
 * 3. Sets the JPEG quality.
 * 4. Saves the processed image to a local '/public/docs' directory on the server.
 * 5. Returns the processed image as a new base64 string (JPEG format) for further use (e.g., uploading to Sumsub)
 * and the **relative file path** where it was saved (e.g., 'public/docs/filename.jpeg').
 * @param {ProcessImageOptions} options - The options for image processing.
 * @returns {Promise<{ processedBase64: string, filePath: string }>} An object containing the processed base64 string and the local file path.
 * @throws {Error} If the base64 string format is invalid or image processing fails.
 */
function processAndConvertImage(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { base64Data, applicantId, docType, docSide, maxWidth = 640, // Default max width changed to 640
        maxHeight = 640, // Default max height changed to 640
        quality = 80 // Default JPEG quality (0-100)
         } = options;
        try {
            // Extract base64 content and MIME type from the data URL string
            const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
            if (!matches) {
                throw new Error("Invalid base64 string format provided for image processing. Expected 'data:image/jpeg;base64,...'");
            }
            const mimeType = matches[1]; // e.g., 'image/jpeg'
            const base64Content = matches[2]; // The actual base64 encoded binary data
            // Read the image using Jimp from the base64 buffer
            const image = yield jimp_1.default.read(Buffer.from(base64Content, 'base64'));
            // Set the JPEG quality for the image (0-100)
            image.quality(quality);
            // Resize the image to fit within the maxWidth and maxHeight, maintaining aspect ratio.
            // Jimp.AUTO automatically calculates the other dimension.
            image.scaleToFit(maxWidth, maxHeight);
            // Generate a unique filename for the saved image
            const uniqueId = (0, uuid_1.v4)();
            // Construct a descriptive filename (e.g., applicantId-ID_CARD-FRONT-uuid.jpeg)
            const filename = `${applicantId}-${docType}${docSide ? `-${docSide}` : ''}-${uniqueId}.jpeg`;
            // Define the absolute path where the file will be saved
            const absoluteFilePath = path_1.default.join(ABSOLUTE_UPLOADS_DIR, filename);
            // Define the relative path that will be returned
            const relativeFilePath = path_1.default.join(RELATIVE_UPLOADS_BASE_PATH, filename);
            // Save the processed image to the specified file path on the server
            yield image.writeAsync(absoluteFilePath);
            console.log(`[ImageProcessor] Image saved locally to: ${absoluteFilePath}`);
            // Get the processed image back as a base64 string (always in JPEG format for consistency)
            const processedBase64 = yield image.getBase64Async(jimp_1.default.MIME_JPEG);
            // Return both the processed base64 string and the relative file path
            return { processedBase64, filePath: relativeFilePath };
        }
        catch (error) {
            console.error(`[ImageProcessor] Error processing and saving image: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error(`Failed to process or save image: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}
exports.processAndConvertImage = processAndConvertImage;
//# sourceMappingURL=imageProcessor.js.map