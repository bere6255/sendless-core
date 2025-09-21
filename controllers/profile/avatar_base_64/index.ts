import * as dotenv from "dotenv";
dotenv.config()
import { NextFunction, Request, Response } from "express"
import { v4 as uuidv4 } from "uuid";
import User from "../../../models/User";
import validation from "./validation";
import imageUpload from "../../../utils/imageUpload";
import redisConnection from "../../../redis/redisConnection";
import AppError from "../../../utils/AppError";
const APP_URL = process.env.APP_URL;
const logPrefix = "PROFILE:AVATER";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}
		const { image } = value;

		const userId = req.user.id;
		const user = await User.query().findOne({
			id: userId,
		});

		if (!user) {
			throw new AppError("User does not exist", 400, logPrefix, {});
		}

		const dataArr = image.split(",");
		if (
			dataArr.includes("data:image/jpeg;base64") !== true &&
			dataArr.includes("data:image/png;base64") !== true
		) {
			throw new AppError("File must be of type jpg, jpeg", 400, logPrefix, {});
		}

		const filename = `${uuidv4()}`;
		const folder = "public/profile"
		const avatar = `/${folder}/${filename}.jpg}`;
		const avatar2 = `/${folder}/${filename}_600.jpg}`;
		await imageUpload({ imageData: image, folder, filename, h: 100, v: 100 });
		await imageUpload({ imageData: image, folder, filename: `${filename}_600`, h: 600, v: 600 });


		await User.query()
			.where({
				id: userId,
			})
			.update({
				avatar: JSON.stringify([avatar, avatar2]),
				updated_at: new Date(),
			})
			.catch((error: any) => {
				throw new AppError("Failed to upload avatar - please try again later", 400, logPrefix, {});
			});

		await redisConnection({ type: "delete", key: `users:${userId}`, value: null, time: null });
		return res.status(201).send({
			message: "Avatar updated successfully",
			data: { avatar: [`${APP_URL}${avatar}`, `${APP_URL}${avatar2}`] },
			status: "success",
		});
	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);
	}
};
