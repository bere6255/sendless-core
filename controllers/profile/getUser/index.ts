import { NextFunction, Request, Response } from "express"
import getUser from "../../../services/profile/getUser";
const logPrefix = "[PROFILE:GETUSER:CONTROLLER]";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		console.log(`${logPrefix} init ===> user_id: ${user.id}`);

		const getUserRes = await getUser({ userId: user.id });
		return res.status(getUserRes.statusCode).send({
			status: getUserRes.status,
			data: getUserRes.data,
			message: getUserRes.message,
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}