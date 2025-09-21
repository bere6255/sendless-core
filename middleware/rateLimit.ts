require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import redisConnection from "../redis/redisConnection";
const logPrefix = "[RATE:LIMIT:MID]";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

        const ip = req.ip || req.connection.remoteAddress;
        const clientId = req.headers['client-id'] || req.headers['user-agent'];

        console.log(`[${new Date().toISOString()}] ${logPrefix} ===>: Method: ${req.method} URL: ${req.originalUrl} IP: ${ip} Client-ID: ${clientId}`);
        const lockID = `ratelimit:${ip}:${clientId}:${req.method}:${req.originalUrl}`;
        // ===check suspiciuse ip

        const checkIp = await redisConnection({ type: "get", key: `forbidden:${ip}:${clientId}`, value: null, time: null });
        if (checkIp) {
            return res.status(403).send('Forbidden');
        }

        // === Block suspicious paths ===
        const forbiddenPaths = [
            '/.git', '/.env', '/.env.testing', '/.env.production',
            '/wp-admin', '/wordpress', '/phpmyadmin'
        ];
        const requestUrl = req.url.toLowerCase();
  
        if (forbiddenPaths.some(path => requestUrl.startsWith(path))) {
          console.warn(`[${new Date().toISOString()} BLOCKED PATH] IP: ${req.ip} tried to access ${requestUrl}`);
          await redisConnection({ type: "lock", key: `forbidden:${ip}:${clientId}`, value: lockID, time: 3000000000 });
          return res.status(403).send('Forbidden');
        }
        
        const checkRequest = await redisConnection({ type: "get", key: lockID, value: null, time: null });
        if (checkRequest) {
            return res.status(429).json({ status: false, data: {}, message: 'Too many requests. Try again shortly.' });
        }
        await redisConnection({ type: "lock", key: lockID, value: lockID, time: 10 });

        next()
    } catch (error: any) {
        console.log(`${logPrefix} error ===>`, error.message, error.stack);
        return res.status(401).send({
            status: false,
            data: {},
            message: "Try again shortly.",
        });
    }

}