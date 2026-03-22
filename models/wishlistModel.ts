import { Schema, model, Document, Types } from "mongoose";


export interface IWishlist extends Document {
  user: Types.ObjectId;
  items: Types.ObjectId[];
 
}


const wishistlSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
       {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
    ],


  },
  { timestamps: true }
);



const Wishlist = model<IWishlist>("wishlist", wishistlSchema);
 export default Wishlist
