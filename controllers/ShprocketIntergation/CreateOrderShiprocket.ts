import type { Request, Response } from "express";
import { generateToken } from "./AuthShipRocket.ts";
import Order from "../../models/orderModel.ts";
import axios from "axios";


export const createDeleveryOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const token = await generateToken();

    const { orderid, length, breadth, height, weight } = req.body;

    if (!orderid) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order: any = await Order.findById(orderid)
      .populate("address user")
      .populate({
        path: "orderItems.product",
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const address = order.address;
    const user = order.user;

    if (!address || !user) {
      return res.status(400).json({
        success: false,
        message: "Address or User not found",
      });
    }

    // Get Pickup Locations
    const pickupResponse = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/settings/company/pickup",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const pickupLocations =
      pickupResponse?.data?.data?.shipping_address || [];

    if (!pickupLocations.length) {
      return res.status(400).json({
        success: false,
        message: "No pickup location found in Shiprocket",
      });
    }

    const pickupLocation =
      pickupLocations[0].pickup_location;

    const orderPayload = {
      order_id: `ORDER_${order._id}`,
      order_date: new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),

      pickup_location: pickupLocation,

      billing_customer_name: address.firstName || "",
      billing_last_name: address.lastName || "",
      billing_address: address.street1 || "",
      billing_address_2: address.street2 || "",
      billing_city: address.city || "",
      billing_pincode: Number(address.zipCode),
      billing_state: address.state || "",
      billing_country: "India",
      billing_email: user.email,
      billing_phone: String(address.phoneNumber).replace(
        /^0+/,
        ""
      ),

      shipping_is_billing: true,

      order_items: order.orderItems.map((item: any) => ({
        name: item.product?.title || "Product",
        sku: item.product?._id?.toString(),
        units: Number(item.quantity),
        selling_price: Number(item.price),
        hsn: 441122,
      })),

      payment_method: "Prepaid",

      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,

      sub_total: Number(order.totalPrice),

      length: Number(length),
      breadth: Number(breadth),
      height: Number(height),
      weight: Number(weight),
    };

    // console.log(
    //   "SHIPROCKET ORDER PAYLOAD =>",
    //   JSON.stringify(orderPayload, null, 2)
    // );

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


const response2 = await axios.post(
  "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
  {
    shipment_id: response.data.shipment_id
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


const tracking_code =  response2?.data.response.data.awb_code
order.trackingid = tracking_code
order.status="completed"

await order.save()
    return res.status(200).json({
      success: true,
      message: "Delivery order created successfully",
      
    });
  } catch (error: any) {
    

    return res.status(
      error?.response?.status || 500
    ).json({
      success: false,
      message: "Failed to create delivery order",
      error: error?.response?.data || error.message,
    });
  }
};