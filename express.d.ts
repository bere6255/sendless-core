// import superagent from "superagent";
export {};

declare global {
  namespace Express {
    interface Request {
      user: any;
      token: string;
      redis: any
    }
  }
}
