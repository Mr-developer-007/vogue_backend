import type { Request, Response } from "express";
import Coupon from "../models/couponcode.ts";

export const CreateCouponCode = async (req: Request, res: Response) => {
  try {
    const {
      couponcode,
      min_order_amount,
      type,
      number,
      usageLimit,
      expiryDate,
    } = req.body;

 
    if (!couponcode || !number) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and discount value are required",
      });
    }

 
    const code = couponcode.toUpperCase();

  
    const couponAllready = await Coupon.findOne({ couponcode: code });

    if (couponAllready) {
      return res.status(409).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    // 🔹 Create coupon
    const newCoupon = await Coupon.create({
      couponcode: code,
      min_order_amount: min_order_amount || 0,
      type: type || "amount",
      number,
      usageLimit: usageLimit || 1,
      expiryDate,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon: newCoupon,
    });

  } catch (error) {
    console.error("Create Coupon Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create coupon",
    });
  }
};

export const getAllCouponCode = async (req: Request, res: Response) => {
  try {
    const code = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: code.length,
      coupons: code,
    });

  } catch (error) {
    console.error("Get Coupon Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
    });
  }
};


export const deleteCouponCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 🔒 Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Coupon ID is required",
      });
    }

    // 🔹 Delete coupon
    const deleted = await Coupon.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      coupon: deleted,
    });

  } catch (error) {
    console.error("Delete Coupon Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
    });
  }
};

export const applyCouponCode = async(req: Request, res: Response)=>{
try {
  const {couponcode,cartTotal} = req.body;
  
 if (!couponcode || !cartTotal) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and cart total are required",
      });
    }
    const code = couponcode.toUpperCase();




  const coupon = await Coupon.findOne({couponcode});



   if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }
     if (!coupon.status) {
      return res.status(400).json({
        success: false,
        message: "Coupon is inactive",
      });
    }


     if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon expired",
      });
    }
 if (cartTotal < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order should be ${coupon.min_order_amount}`,
      });
    }


let discount = 0;

    if (coupon.type === "percentage") {
      discount = (cartTotal * coupon.number) / 100;
    } else {
      discount = coupon.number;
    }

 if (discount > cartTotal) {
      discount = cartTotal;
    }
    coupon.usedCount += 1;
    await coupon.save();

  const finalAmount = cartTotal - discount;

  res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discount,
      finalAmount,
      coupon,
    });
} catch (error) {
  console.error("Apply Coupon Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to apply coupon",
    });
}
}


