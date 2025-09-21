import { NextFunction, Request, Response } from "express"
import redisConnection from "../../../redis/redisConnection";
const logPrefix = "[AUTH:LOGOUT:CONTROLLER]";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(`${logPrefix} init ===> user: ${req.user.email}`,);

		const token = req.token;

		await redisConnection({ type: "lock", key: `blackList:${token}`, value: token, time: 2592000 });

		return res.status(200).send({
			status: "success",
			data: {},
			message: "Logout successfully",
		});
	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}