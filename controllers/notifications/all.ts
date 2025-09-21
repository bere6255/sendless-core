import { NextFunction, Request, Response } from "express"
import { getNotification } from "../../helpers/notifications"
const logPrefix = "NOTOFICATIONS:ALL:CONTROLLER";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		const notification = await getNotification({ userId: user.id });
		return res.status(200).send({
			status: "success",
			data: { notification: notification },
			message: " successful",
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}