import { Request, Response, NextFunction } from "express";
import login from "./login";
import postForgot from "./postForgot";
import restPasswordToken from "./restPasswordToken";
import register from "./register";
import sendOTP from "./sendOTP";
import logout from "./logout";
import countries from "./countries";

export default {
  login: async (req: Request, res: Response, next: NextFunction) =>
    await login(req, res, next),

  logout: async (req: Request, res: Response, next: NextFunction) =>
    await logout(req, res, next),

  countries: async (req: Request, res: Response, next: NextFunction) =>
    await countries(req, res, next),

  postForgot: async (req: Request, res: Response, next: NextFunction) =>
    await postForgot(req, res, next),

  restPasswordToken: async (req: Request, res: Response, next: NextFunction) =>
    await restPasswordToken(req, res, next),

  register: async (req: Request, res: Response, next: NextFunction) =>
    await register(req, res, next),

  sendOTP: async (req: Request, res: Response, next: NextFunction) =>
    await sendOTP(req, res, next),
};
