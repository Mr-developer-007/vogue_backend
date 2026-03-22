import type {Request,Response ,NextFunction} from "express"
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken"
import User from "../models/userModel.ts";


interface TokenPayload extends JwtPayload {
  id: string
}
interface AuthRequest extends Request {
  user?: any
}

export const verifyAdmin = async(req:AuthRequest,res:Response,next:NextFunction)=>{
    try {
const token = req.cookies.auth_token;
 if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" })
    }
const tokenVal =  jwt.verify(token,process.env.JWT_SECRET!) as TokenPayload


const admin = await User.findOne({_id:tokenVal?.id as string,role:"admin"}).select("-password")
 if (!admin) {
      return res.status(403).json({ message: "Access denied" })
    }

 req.user = admin;

    next()


    } catch (error) {
           return res.status(401).json({ message: "Invalid or expired token" })
 
    }
}