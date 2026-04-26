import mongoose, { model, Schema } from "mongoose";
import { Document } from "mongoose";

interface IorderItems {
   product: mongoose.Schema.Types.ObjectId;
   price:Number;
   quantity:Number
}

interface IOrder extends Document{
user: mongoose.Schema.Types.ObjectId;
address: mongoose.Schema.Types.ObjectId;
status: "pending" | "completed" | "failed";
paymentStatus: "pending" | "paid" | "failed";

itemsPrice:Number;
image:String;
size:String;
discountPrice:Number;
totalPrice:Number;
orderStatus: "processing" |"confirmed" | "shipped" | "out_for_delivery" | "delivered" |"cancelled";
deliveredAt:Date;
orderItems: IorderItems[];
trackingid:string | null;
}


const orderSchema = new Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
        required: true,
    },
    orderItems: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
          image:{type: String},
          size:{type: String},
         price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        }
    ],
     status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    paymentStatus:{
      type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",   
    },
      itemsPrice: { type: Number, required: true },
      discountPrice: { type: Number, default: 0 },
      totalPrice: { type: Number, required: true },
      orderStatus: {
        type: String,
        enum: [
            "processing",
            "confirmed",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled",
        ],
        default: "processing",
    },
        deliveredAt: { type: Date },
     trackingid:{
        type:String,
        default :null
     }
},{
    timestamps:true 
})

const Order = model<IOrder>("order",orderSchema)

export default Order;

