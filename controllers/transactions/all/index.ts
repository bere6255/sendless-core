import { NextFunction, Request, Response } from "express"
import transactions from "../../../services/wallet/transactions/all"
const logPrefix = "[WALLET:TRANSACTIONS:CONTROLLER]";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;

		let page = <any>'0';
		let limit = <any>'20';
		let type = <any>null;
		
		if (req.query.page) {
			page = req.query.page;
		}
		if (req.query.type) {
			if (req.query.type==="funding" || req.query.type ==="disburse" || req.query.type ==="transfer") {
				type = "main";
			}else{
				type = req.query.type;
			}
			
		}
		if (req.query.limit) {
			limit = req.query.limit;
		}
		console.log(`${logPrefix} init ===> User email ${user.email}`);
		const walletTransactions = await transactions({ user, type, page, limit });

		return res.status(walletTransactions.status ? 200 : 400).send({
			status: walletTransactions.status,
			data: walletTransactions.data,
			message: walletTransactions.message,
		});

	} catch (error: any) {
	error.logPrefix = logPrefix;
		next(error);

	}
}