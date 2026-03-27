import express from "express";
import { applyCouponCode, CreateCouponCode, deleteCouponCode, getAllCouponCode } from "../controllers/CouponCodeController.ts";
import { verifyAdmin } from "../middlewere/verifyMiddlewere.ts";
import { verifyUser } from "../middlewere/verifyUserMiddlewere.ts";

const route = express.Router();

route.post("/create",verifyAdmin,CreateCouponCode)
route.get("/getall",verifyAdmin,getAllCouponCode)
route.delete("/delete/:id",verifyAdmin,deleteCouponCode)
route.post("/apply",verifyUser,applyCouponCode)
export default route
