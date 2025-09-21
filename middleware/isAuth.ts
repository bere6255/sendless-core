import * as dotenv from "dotenv";
dotenv.config()
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import redisConnection from "../redis/redisConnection";
import getUser from "../services/profile/getUser";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const logPrefix = "[MIDDLEWARE:ISAUTH]";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        // checking if auth header contains token
        if (!req.headers || !req.headers.authorization) {
            return res.status(401).send({
                status: false,
                data: {},
                message: "no authorization header found",
            });
        }

        // getting authorization header

        const bearerHeader = req.headers.authorization;
        // splitting bearer

        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];

        const verify = jwt.verify(bearerToken, ENCRYPTION_KEY);
        // check if user exist
        const jwtPayload = <any>verify
        if (!jwtPayload.exp) {

            return res.status(401).send({
                status: false,
                data: {},
                message: "Unauthorized login",
            });
        }
        // check if token is black listed
        const checkBlackList = await redisConnection({ type: "get", key: `blackList:${bearerToken}`, value: null, time: null });
        if (checkBlackList) {
            return res.status(401).send({
                status: false,
                data: {},
                message: "Unauthorized login",
            });
        }
        let user;
        // get user from redis
        const getRedisUser = await redisConnection({ type: "get", key: `users:${jwtPayload.id}`, value: null, time: null });
        if (getRedisUser) {
            user = JSON.parse(getRedisUser);
        } else {
            const userDetails = await getUser({ userId: jwtPayload.id });
            user = userDetails?.data?.user;
        }

        if (user.banned_at) {
            return res.status(401).send({
                status: false,
                data: {},
                message: "Account banned please contact support",
            });
        }

        req.token = bearerToken;
        req.user = user;


        next()
    } catch (error: any) {
        console.log(`${logPrefix} error ===> `, error.message, error.stack);

        return res.status(401).send({
            status: " fail",
            data: {},
            message: "Unauthorized, login"
        })
    }

}