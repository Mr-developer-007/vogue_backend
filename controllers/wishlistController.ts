import type { Request, Response } from "express";
import Wishlist from "../models/wishlistModel.ts";

interface AuthRequest extends Request{
      user?: any

}

const addtoWishlist = async(req:AuthRequest,res:Response)=>{
try {
    
} catch (error) { 
    
}
}


export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const wishList = await Wishlist.findOne({ user: user._id })
    .populate({
    path: "items",
    select: "slug title sellingPrice compareAtPrice quantity images productfor",   // 👈 only these fields
  })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: wishList,
    });

  } catch (error) {
    console.error("Get Wishlist Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const removeFromWishList = async (req: AuthRequest, res: Response) => {
  try {
    const wishlistPid = req.params.id;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const wishList = await Wishlist.findOne({ user: user._id });

    if (!wishList) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    console.log(wishList)
    wishList.items = wishList.items.filter(
      (item) => item.toString() !== wishlistPid
    );

    await wishList.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
      data: wishList,
    });

  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

