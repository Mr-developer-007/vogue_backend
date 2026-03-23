import express from "express";
import { createController, deleteOrder, getFullOrder, getOrder, gettAllorder, orderStatusUpdate, PaymentStatusUpdate, StatusUpdate, UpdateTrackingNumber, verifyPayment } from "../controllers/orderController.ts";
import { verifyUser } from "../middlewere/verifyUserMiddlewere.ts";
import { verifyAdmin } from "../middlewere/verifyMiddlewere.ts";

const route = express.Router();


route.post("/create",verifyUser,createController as any)
route.post("/verify-payment",verifyUser,verifyPayment as any)
route.get("/get",verifyUser,getOrder as any)
route.get("/allorder",verifyAdmin,gettAllorder as any)
route.get("/getorder/:orderid",verifyAdmin,getFullOrder as any)
route.put("/updateorderstatus/:id",verifyAdmin,orderStatusUpdate as any)
route.put("/updatepaymentstatus/:id",verifyAdmin,PaymentStatusUpdate as any)
route.put("/updatestatus/:id",verifyAdmin,StatusUpdate as any)
route.put("/updateTrackingNumber/:id",verifyAdmin,UpdateTrackingNumber as any)
route.delete("/deleteorder/:id",verifyAdmin,deleteOrder as any)

export default route