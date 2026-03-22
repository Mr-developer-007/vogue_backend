import { Schema, model, Document, Types } from "mongoose";

/* ---------- Interfaces ---------- */
export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  size:string;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}


const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        size:{
            type:String
        }
      },
    ],

    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* ---------- Model ---------- */
 const Cart = model<ICart>("Cart", cartSchema);
 export default Cart
