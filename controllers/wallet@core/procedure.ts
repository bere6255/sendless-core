import { Request, Response } from "express"
import procedures from "../../services/wallet@core/procedures/v1"

const logPrefix = "[Procedure Countroller]"

export default async (req: Request, res: Response) => {
	try {
		console.log(`${logPrefix} call ===> `, JSON.stringify(req.body));

		const procedureRes = await procedures();
		
		return res.status(200).send({
			status: true,
			data: procedureRes,
			message: "successful",
		});


	} catch (error: any) {
		console.log(`${logPrefix} Error ======>`, error.message, error.stack);
		return res.status(400).send({
			status: false,
			data: {},
			message: "Failed, please try again in a few minutes"
		});

	}
}