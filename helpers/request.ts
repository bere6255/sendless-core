import { Request } from "express"
export interface AddUserToReq extends Request {
  user: any // or any other type
}