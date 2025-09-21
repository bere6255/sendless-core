import { Request, Response, NextFunction } from "express";
import AppError from "../../../utils/AppError";
import { sumsubClient } from "../../../configs/sumsubClient";

const logPrefix = "[AUTH:SUMSUB:CONTROLLER]";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        console.log(
            `${logPrefix} init ===> User: ${user.email}`);

        const resp = await sumsubClient.post(`/resources/accessTokens?userId=${user.email}&levelName=basic-kyc`);

        return res.status(200).send({
            status: true,
            data: { resp },
            message: "Token generated successfully",
        });
    } catch (error: any) {
        error.logPrefix = logPrefix;
        next(error);
    }
};
