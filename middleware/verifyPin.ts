require("dotenv").config();
import { Request, Response, NextFunction } from "express"
import Pin from "../models/Pin"
import User from "../models/User"
import Bans from "../models/Bans"
import bcrypt from "bcryptjs"
import AppError from "../utils/AppError";
const logPrefix = "[MIDDLEWARE:VERIFYPIN]"

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        // checking if auth header contains token
        if (!req.body || !req.body.transactionPin) {
             throw new AppError("Authorization pin not found", 406, logPrefix, {});
        }

        const getPin = await Pin.query().findOne({ user_id: user.id });

        if (!getPin) {
            throw new AppError("Please set authorization pin to complate this request", 406, logPrefix, {});
        }

        const validated = await bcrypt.compare(req.body.transactionPin, getPin.pin);

        let attempt = 0;

        attempt = !getPin.pin_attempts ? 0 : parseInt(getPin.pin_attempts);
        if (validated === false) {
            // ban user for multiple pin attempt error
            if (attempt < 3) {
                attempt = attempt + 1;
                await Pin.query().findOne("user_id", "=", user.id).update({
                    pin_attempts: attempt,
                });
            }
            if (attempt >= 3) {
                await User.query()
                    .patch({ banned_at: new Date() })
                    .where("id", "=", user.id);

                await Bans.query().insert({
                    user_id: user.id,
                    comment: "banned for exceeding pin retry limit",
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                 throw new AppError("banned for exceeding pin retry limit", 406, logPrefix, {});
            }
             throw new AppError(`Incorrect pin, ${5 - attempt
                    } attempts left, please try again`, 406, logPrefix, {});

        }
        if (attempt >= 3) {
             throw new AppError("banned for exceeding pin retry limit", 406, logPrefix, {});
         
        }
        await Pin.query().findOne("user_id", "=", user.id).update({
            pin_attempts: 0,
        });
        req.body.transactionPin = null;
        next()
    } catch (error: any) {
        throw new AppError("Unauthorized, login", 401, logPrefix, {});
    }

}