import multer from "multer"
import { Request, Response, NextFunction } from "express"

export const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message })
  }
  next(err)
}
