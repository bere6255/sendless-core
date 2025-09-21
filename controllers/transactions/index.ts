import { NextFunction, Request, Response } from "express" 
import allTransaction from "./all"
import single from "./single"

export default {
    allTransaction: async (req: Request, res: Response, next: NextFunction) => await allTransaction(req, res, next),
    single: async (req: Request, res: Response, next: NextFunction) => await single(req, res, next),
}
