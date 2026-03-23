

import  type { Request, Response } from "express";
import Razorpay from "razorpay"
import Order from "../models/orderModel.ts";
import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config()

 const razorpay = new Razorpay({
 key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_SECRET as string,
});

interface AuthRequest extends Request{
    user:any
}
export const createController=async(req:AuthRequest,res:Response)=>{
    try {
const user = req.user;


 const { address,itemsPrice,  discountPrice , totalPrice, orderItems} = req.body;



const createProductOrder= await Order.create({user:user._id,
    address,itemsPrice,  discountPrice , totalPrice, orderItems,status:"pending"
})

    const options = {
      amount: totalPrice * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);

          res.json({
      success: true,
      order,
      createProductOrder
    });
    } catch (error) {
            res.status(500).json({ message: "Error creating order" });

    }
}




export const verifyPayment = async (req:AuthRequest,res:Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, 
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

   
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};




export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 }) 
      .limit(limit || 0).populate("address"); 

    return res.status(200).json({
      success: true,
    user,
      data: orders,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const gettAllorder = async (req: AuthRequest, res: Response)=>{
  try {
    const { filter } = req.query;
 let query: any = {};

    const now = new Date();
if (filter === "today") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));

      query.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }
else if (filter === "week") {
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(now.getDate() - now.getDay()); 
      firstDayOfWeek.setHours(0, 0, 0, 0);

      query.createdAt = {
        $gte: firstDayOfWeek,
        $lte: new Date(),
      };
    }
else if (filter === "month") {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  startOfMonth.setHours(0, 0, 0, 0)

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  endOfMonth.setHours(23, 59, 59, 999)

  query.createdAt = {
    $gte: startOfMonth,
    $lte: endOfMonth,
  }
}


  const order = await Order.find(query).sort({ createdAt: -1 });
     return res.json({
      success: true,
      count: order.length,
      order,
    });
  } catch (error : any) {
    return res.status(500).json({success:false,message:error.message})
  }
}

export const getFullOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderid } = req.params;

    const order = await Order.findById(orderid)
      .populate("user", "name email") // optional
      .populate("orderItems.product")
      .populate("address"); // optional (depends on your schema)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const orderStatusUpdate = async(req:AuthRequest, res: Response)=>{
  try {
    const {id} = req.params;
    const {info} = req.body
     if (!info) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const order = await Order.findByIdAndUpdate(id,{orderStatus:info}, { new: true });



        if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
   
    });


  } catch (error :any) {
      return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export const PaymentStatusUpdate = async(req:AuthRequest, res: Response)=>{
  try {
    const {id} = req.params;
    const {info} = req.body
     if (!info) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const order = await Order.findByIdAndUpdate(id,{paymentStatus:info}, { new: true });



        if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order Payment status updated successfully",
   
    });


  } catch (error :any) {
      return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const StatusUpdate = async(req:AuthRequest, res: Response)=>{
  try {
    const {id} = req.params;
    const {info} = req.body
     if (!info) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const order = await Order.findByIdAndUpdate(id,{status:info}, { new: true });



        if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
   
    });


  } catch (error :any) {
      return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}




export const UpdateTrackingNumber = async(req:AuthRequest, res: Response)=>{
  try {
    const {id} = req.params;
    const {info} = req.body
     if (!info) {
      return res.status(400).json({
        success: false,
        message: "trackingid is required",
      });
    }

    const order = await Order.findByIdAndUpdate(id,{trackingid:info}, { new: true });



        if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "trackingid updated successfully",
   
    });


  } catch (error :any) {
      return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};