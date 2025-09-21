import { NextFunction, Request, Response } from "express" 
import setPin from "./setPin"
import updatePin from "./updatePin"
import sendPinOTPP from "./sendPinOTP"

export default {
    setPin: async (req: Request, res: Response, next: NextFunction) => await setPin(req, res, next),
    updatePin: async (req: Request, res: Response, next: NextFunction) => await updatePin(req, res, next),
    sendPinOTPP: async (req: Request, res: Response, next: NextFunction) => await sendPinOTPP(req, res, next),
}
