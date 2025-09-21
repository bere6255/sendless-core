import * as dotenv from "dotenv";
dotenv.config();
import Jimp from "jimp";
import fs from 'fs';
import path from "path";

const logPrefix = "UTILS:IMAGE:FILEUPLOAD";

export default async ({ imageData, folder, filename, h = 100, v = 100 }: { imageData: any, folder: string, filename: string, h: number, v: number }) => {
  try {
    const dataArr = imageData.split(",");
    if (
      dataArr.includes("data:image/jpeg;base64") !== true &&
      dataArr.includes("data:image/png;base64") !== true
    ) {
      console.log(`${logPrefix} type error`);

      return {
        message: "File must be of type jpg, jpeg or png",
        status: false,
      };
    }

    const dataType = dataArr[0].split("/");
    const fileType = dataType[1].split(";");

    const imageBuffer = Buffer.from(dataArr[1], "base64");

    const image = await Jimp.read(imageBuffer);

    // resize image
    await image.resize(h, v);

    // make sure the folder exists
    const folderPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const destFileName = `${filename}.${fileType[0]}`;
    const outputPath = path.join(folderPath, destFileName);

    // save image
    await image
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
  } catch (error: any) {
    console.log(`${logPrefix} error ==> `, error.message, error.stack);
    return {
      status: false,
      message: "Please try again shortly"
    };
  }
};
