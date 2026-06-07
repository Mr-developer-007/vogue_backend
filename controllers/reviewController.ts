
import type { NextFunction, Request, Response } from "express";
import Review from "../models/reviewModel.ts";


export const CreateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, message, place, product,rating } = req.body;

    if (!name || !message || !place || !product) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

   

    const review = await Review.create({
      name,
      message,
      place,
      product,
      rating
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteReview = async(req: Request,res: Response, next: NextFunction) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await review.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};




export const getReview = async(req: Request,res: Response,next: NextFunction)=>{
    try {
        
const productid = req.params.id;

 const reviews = await Review.find({
      product: productid,
    })
      .sort({ createdAt: -1 })
      .lean();

       return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });

    } catch (error) {
            next(error);
    }
}