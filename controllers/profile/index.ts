import { NextFunction, Request, Response } from "express"
import getUser from "./getUser"
import avatar_base_64 from "./avatar_base_64"
import changePassword from "./changePassword"
import addPhone from "./addPhone"
import address from "./address"
import update from "./update"
import verify from "./verify"
import sumsub from "./sumsub"
export default {
    verify: async (req: Request, res: Response, next: NextFunction) => await verify(req, res, next),
    sumsub: async (req: Request, res: Response, next: NextFunction) => await sumsub(req, res, next),
    update: async (req: Request, res: Response, next: NextFunction) => await update(req, res, next),
    address: async (req: Request, res: Response, next: NextFunction) => await address(req, res, next),
    addPhone: async (req: Request, res: Response, next: NextFunction) => await addPhone(req, res, next),
    getUser: async (req: Request, res: Response, next: NextFunction) => await getUser(req, res, next),
    avatar_base_64: async (req: Request, res: Response, next: NextFunction) => await avatar_base_64(req, res, next),
    changePassword: async (req: Request, res: Response, next: NextFunction) => await changePassword(req, res, next),
}
