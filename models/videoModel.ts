import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  video: string;
  product: mongoose.Types.ObjectId;
}

const videoSchema = new Schema(
  {
    video: {
      type: String,
      required: true,
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

export default mongoose.model<IVideo>("Video", videoSchema);