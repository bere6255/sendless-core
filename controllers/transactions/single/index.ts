import { NextFunction, Request, Response } from "express"
import transactions from "../../../services/wallet/transactions/single"
const logPrefix = "[WALLET:TRANSACTIONSDETAILS:CONTROLLER]";
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;
		const { reference } = req.params;
		console.log(`${logPrefix} init ===> User_id ${user.id} reference: ${reference}`);
		const walletTransactions = await transactions({ user, reference });
		return res.status(walletTransactions.statusCode).send({
			status: walletTransactions.status,
			data: walletTransactions?.data || {},
			message: walletTransactions.message,
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}