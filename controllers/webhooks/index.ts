import { NextFunction, Request, Response } from "express" 
import fincra from "./fincra"
import sumsub from "./sumsub"
export default {
    fincra: async (req: Request, res: Response, next: NextFunction) => await fincra(req, res, next),
    sumsub: async (req: Request, res: Response, next: NextFunction) => await sumsub(req, res, next),
}