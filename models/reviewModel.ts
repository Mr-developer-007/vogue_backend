import mongoose, { Document, Schema, Model } from "mongoose";

export interface IReview extends Document {
  name: string;
  message: string;
  place: string;
  product: mongoose.Types.ObjectId;
  rating:Number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
    },
    rating:{
type:Number
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review: Model<IReview> =
  mongoose.models.Review ||
  mongoose.model<IReview>("Review", reviewSchema);

export default Review;