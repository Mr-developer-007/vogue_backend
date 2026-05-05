import type { Request, Response } from "express";
import { generateToken } from "./AuthShipRocket.ts";
import Order from "../../models/orderModel.ts";
import axios from "axios";


export const createDeleveryOrder= async(req: Request, res: Response)=>{
try {
    const token = await generateToken();
  const {orderid,length,breadth,height,weight} = req.body
   if (!orderid) {
      return res.status(400).json({ message: "Order ID is required" });
    }

  const order: any = await Order.findById(orderid)
      .populate("address user")
      .populate(["orderItems.product"]);
   if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }


 const address = order.address;
    const user = order.user;
    if (!address || !user) {
      return res.status(400).json({ message: "Address/User missing" });
    }



const orderPayload = {
  order_id: `ORDER_${Date.now()}`,
  order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
  pickup_location: "Primary",

  billing_customer_name: address.firstName,
  billing_last_name: address.lastName,
  billing_address: address.street1,
  billing_address_2: address.street2 || "",
  billing_city: address.city,
  billing_pincode: Number(address.zipCode),
  billing_state: "Himachal Pradesh", // FIXED
  billing_country: "India",
  billing_email: user.email,
  billing_phone: address.phoneNumber.replace(/^0+/, ""), // FIXED

  shipping_is_billing: true,

  order_items: order.orderItems.map((item: any) => ({
    name: item.product.title,
    sku: item._id.toString(), // FIXED
    units: item.quantity,
    selling_price: item.price,
    hsn: 441122,
  })),
shipping_charges: 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
  payment_method: "Prepaid",
  sub_total: order.totalPrice,

  length: Number(length),   
  breadth: Number(breadth),
  height: Number(height),
  weight: Number(weight),
};

console.log(JSON.stringify(orderPayload, null, 2));

  const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      orderPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response)

    return res.status(200).json({
      success: true,
      message: "Delivery order created",
      data: response.data,
    });
    
} catch (error:any) {
        console.error("Shiprocket Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create delivery order",
      error: error?.response?.data || error.message,
    });

}
}