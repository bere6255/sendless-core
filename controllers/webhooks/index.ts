import { NextFunction, Request, Response } from "express" 
import fincra from "./fincra"
export default {
    fincra: async (req: Request, res: Response, next: NextFunction) => await fincra(req, res, next),
}