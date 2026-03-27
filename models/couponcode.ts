import mongoose, { Document, Schema } from "mongoose";

interface ICoupon extends Document {
  couponcode: string;
  min_order_amount: number;
  number: number; // discount value
  type: "percentage" | "amount";
  status: boolean;
  usageLimit: number;
  usedCount: number;
  expiryDate: Date;
}

const couponSchema = new Schema(
  {
    couponcode: {
      type: String,
      required: true,
      trim: true,
      unique: true, 
      minlength: [6, "Minimum 6 characters required"],
      maxlength: [10, "Maximum 10 characters allowed"],
     
    },

    min_order_amount: {
      type: Number,
      default: 0,
    },

    type: {
      type: String,
      enum: ["percentage", "amount"],
      default: "amount",
    },

    number: {
      type: Number,
      required: true,
      min: [1, "Discount must be at least 1"],
    },

    status: {
      type: Boolean,
      default: true,
    },

    usageLimit: {
      type: Number,
      default: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);

export default  Coupon;