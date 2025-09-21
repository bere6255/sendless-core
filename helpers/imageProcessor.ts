import Jimp from 'jimp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fsSync from 'fs';

const ABSOLUTE_UPLOADS_DIR = path.join(process.cwd(), 'public', 'docs');
const RELATIVE_UPLOADS_BASE_PATH = path.join('public', 'docs');

if (!fsSync.existsSync(ABSOLUTE_UPLOADS_DIR)) {
    fsSync.mkdirSync(ABSOLUTE_UPLOADS_DIR, { recursive: true });
}

/**
 * Options for the processAndConvertImage function.
 * @property {string} base64Data - The input image as a base64 string (e.g., 'data:image/jpeg;base64,...').
 * @property {string} applicantId - The ID of the applicant, used for naming the saved file.
 * @property {string} docType - The type of document (e.g., 'PASSPORT', 'ID_CARD'), used for naming.
 * @property {string} [docSide] - The side of the document (e.g., 'FRONT', 'BACK'), used for naming.
 * @property {number} [maxWidth=640] - The maximum width for the resized image (default 640 pixels).
 * @property {number} [maxHeight=640] - The maximum height for the resized image (default 640 pixels).
 * @property {number} [quality=80] - The JPEG quality (0-100) for the saved image.
 */
interface ProcessImageOptions {
    base64Data: string;
    applicantId: string;
    docType: string;
    docSide?: string;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
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
export async function processAndConvertImage(options: ProcessImageOptions): Promise<{ processedBase64: string, filePath: string }> {
    const {
        base64Data,
        applicantId,
        docType,
        docSide,
        maxWidth = 640, // Default max width changed to 640
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
        const image = await Jimp.read(Buffer.from(base64Content, 'base64'));

        // Set the JPEG quality for the image (0-100)
        image.quality(quality);

        // Resize the image to fit within the maxWidth and maxHeight, maintaining aspect ratio.
        // Jimp.AUTO automatically calculates the other dimension.
        image.scaleToFit(maxWidth, maxHeight);

        // Generate a unique filename for the saved image
        const uniqueId = uuidv4();
        // Construct a descriptive filename (e.g., applicantId-ID_CARD-FRONT-uuid.jpeg)
        const filename = `${applicantId}-${docType}${docSide ? `-${docSide}` : ''}-${uniqueId}.jpeg`;

        // Define the absolute path where the file will be saved
        const absoluteFilePath = path.join(ABSOLUTE_UPLOADS_DIR, filename);
        // Define the relative path that will be returned
        const relativeFilePath = path.join(RELATIVE_UPLOADS_BASE_PATH, filename);


        // Save the processed image to the specified file path on the server
        await image.writeAsync(absoluteFilePath);
        console.log(`[ImageProcessor] Image saved locally to: ${absoluteFilePath}`);

        // Get the processed image back as a base64 string (always in JPEG format for consistency)
        const processedBase64 = await image.getBase64Async(Jimp.MIME_JPEG);

        // Return both the processed base64 string and the relative file path
        return { processedBase64, filePath: relativeFilePath };
    } catch (error) {
        console.error(`[ImageProcessor] Error processing and saving image: ${error instanceof Error ? error.message : String(error)}`);
        throw new Error(`Failed to process or save image: ${error instanceof Error ? error.message : String(error)}`);
    }
}
