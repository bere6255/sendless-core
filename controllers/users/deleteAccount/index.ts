import { NextFunction, Request, Response } from "express"
import User from "../../../models/User";
const logPrefix = "USER:DELETE_ACCOUNT:CONTROLLER";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log("Delete Account call ===> ", JSON.stringify(req.body));
		const user = req.user;

		// Soft Delete
		await User.query().findOne({ id: user.id }).update({
			deleted_at: new Date
		})

		return res.status(200).send({
			status: true,
			data: {},
			message: `We miss you, hope you come back`,
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}