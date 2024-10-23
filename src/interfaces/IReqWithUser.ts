import {Request} from "express"
import { User } from "src/models/user.model"

export interface IReqWithUser extends Request {
  user: User
}