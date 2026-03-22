import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel.ts";
import jwt from "jsonwebtoken";


interface TokenPayload extends JwtPayload {
    id: string
}

interface AuthRequest extends Request {
    user?: any
}
export const verifyUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies.user_token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token" })
        }
        const tokenVal = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload


        const user = await User.findOne({ _id: tokenVal?.id as string, role: "user" }).select("-password")
        if (!user) {
            return res.status(403).json({ message: "Access denied" })
        }

        req.user = user;

        next()


    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })

    }

}