import { NextFunction, Request, Response } from "express" 
import get from "./get"

export default {
    get: async (req: Request, res: Response, next: NextFunction) => await get(req, res, next),
}
