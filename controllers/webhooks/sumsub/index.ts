import * as dotenv from "dotenv";
dotenv.config()
import { NextFunction, Request, Response } from "express"
// mbzWBcBPQWEV3gDs8kkmARAE4tD
const logPrefix = "WEBHOOK:SUMSUB:CONTROLLER";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(`${logPrefix} init ===> body: `, JSON.stringify(req.body));


		const { event, data } = req.body;

		return res.status(200).send({
			status: "success",
			data: {},
			message: "successfull ",
		});

	} catch (error: any) {
		// Centralized error handling
		error.logPrefix = logPrefix;
		next(error); // Pass the error to the Express error handling middleware

	}
}