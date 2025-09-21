import { NextFunction, Request, Response } from "express"
import Refferal from "../../../models/Refferal";
const logPrefix = "[USER:REFERREALS:CONTROLLER]"
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(`${logPrefix} init ===> `, JSON.stringify(req.body));
		const user = req.user;
		const getRefferal = await Refferal.query().where({ user_id: user.id }).withGraphFetched("user");
		let pNumber = 0;
		let pdNumber = 0;
		for (let index = 0; index < getRefferal.length; index++) {
			const element = getRefferal[index];
			if (getRefferal[index].status === "paid") {
				pdNumber = pdNumber + 1;
			} else if (getRefferal[index].status === "pending") {
				pNumber = pNumber + 1;
			}
		}

		const potentialPayout = pNumber * 100;

		const Payout = pdNumber * 100;

		return res.status(200).send({
			status: "success",
			data: { referral: getRefferal, potentialPayout, Payout },
			message: `Refferal fetch successfully`,
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);
	}
}