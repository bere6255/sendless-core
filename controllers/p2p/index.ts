import { NextFunction, Request, Response } from "express" 
import nameEnquiry from "./nameEnquiry"
import send from "./send"

export default {
    nameEnquiry: async (req: Request, res: Response, next: NextFunction) => await nameEnquiry(req, res, next),
    send: async (req: Request, res: Response, next: NextFunction) => await send(req, res, next),
}
