import { NextFunction, Request, Response } from "express" 
import verify from "./verify"
import deleteAccount from "../users/deleteAccount"
import createTag from "./createTag"
import checkTag from "./checkTag"
import referrals from "./referrals"

export default {
    verify: async (req: Request, res: Response, next: NextFunction) => await verify(req, res, next),
    referrals: async (req: Request, res: Response, next: NextFunction) => await referrals(req, res, next),
    createTag: async (req: Request, res: Response, next: NextFunction) => await createTag(req, res, next),
    checkTag: async (req: Request, res: Response, next: NextFunction) => await checkTag(req, res, next),
    deleteAccount: async (req: Request, res: Response, next: NextFunction) => await deleteAccount(req, res, next),
}