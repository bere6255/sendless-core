import * as dotenv from "dotenv";
dotenv.config()
import { NextFunction, Request, Response } from "express"
import User from "../../../models/User";
import VirtualAccounts from "../../../models/VirtualAccounts";
import funding from "../../../services/wallet@core/funding";
import crypto from "crypto";
const FINCRA_SECRET_KEY = process.env.FINCRA_SECRET_KEY || "";
const logPrefix = "WEBHOOK:FINCRA:CONTROLLER";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(`${logPrefix} init ===> body: `, JSON.stringify(req.body));

		const encryptedData = crypto
			.createHmac("SHA512", FINCRA_SECRET_KEY)
			.update(JSON.stringify(req.body))
			.digest("hex");
		const signatureFromWebhook = req.headers['signature'];
	
		if (encryptedData !== signatureFromWebhook) {
			console.log(`${logPrefix} invalid signature ===> `, JSON.stringify(req.body));
			return res.status(200).send({
				status: "success",
				data: {},
				message: "successfull ",
			});
		}

		const { event, data } = req.body;

		if (event === "collection.successful") {
			const userAccount = await VirtualAccounts.query().where({ account_number: data.virtualAccount });
			if (userAccount.length === 0) {
				console.log(`${logPrefix} account not found ===> `, JSON.stringify(req.body));
				return res.status(400).send({
					status: "fail",
					data: {},
					message: "Account not found ",
				});
			}
			if (userAccount.length > 1) {
				console.log(`${logPrefix} duplecate account ===> `, JSON.stringify(req.body));
				return res.status(400).send({
					status: "fail",
					data: {},
					message: "Account not found ",
				});
			}
			const user = await User.query().findOne({ id: userAccount[0].user_id });
			if (!user) {
				console.log(`${logPrefix} users account ===> `, JSON.stringify(req.body));
				return res.status(400).send({
					status: "fail",
					data: {},
					message: "Account not found ",
				});
			}
			 await funding({
				user_id: user.id,
				peer_user_id: "4",
				user_phone: user.phone,
				meta: data,
				provider: "fincra",
				user_email: user?.email,
				walletType:"NGN",
				description: data.description,
				reference: data.reference,
				amount: data.amountReceived * 100,
				charge: 0,
				type: "funding",
				outward: false,
				uniqueKey: data.sessionId
			});


		}

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