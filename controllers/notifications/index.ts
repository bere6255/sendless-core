import { NextFunction, Request, Response } from "express" 
import all from "./all"

export default {
    all: async (req: Request, res: Response, next: NextFunction) => await all(req, res, next),
}