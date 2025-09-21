import { NextFunction, Request, Response } from "express"
import countries from "../../../constants/countries";
const logPrefix = "[AUTH:COUNTRIES:CONTROLLER]";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {

		const simplifiedCurrencies = countries.map(({ icon, name, dialCode, symbol, alpha3Code }) => ({
			icon,
			name,
			dialCode,
			symbol, 
			alpha3Code
		}));

		return res.status(200).send({
			status: "success",
			data: { countries: simplifiedCurrencies },
			message: "Countries loaded successfully",
		});
	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);

	}
}