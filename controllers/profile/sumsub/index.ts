import { NextFunction, Request, Response } from "express"
import { log } from "console";
import { sumsubClient } from "../../../configs/sumsubClient";
const logPrefix = "PROFILE:SUMSUB:CONTROLLER";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		console.log(`${logPrefix} init ===> user id: ${user.id} `);


		const resp = await sumsubClient.post(`/resources/accessTokens?userId=${user.email}&levelName=basic-kyc`);
		log(`${logPrefix} sumsub response ===> ${JSON.stringify(resp.data)}`);
	
		return res.status(200).send({
			status: true,
			data: { ...resp.data },
			message: "Token generated successfully",
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}