import express from "express";
import { createDeleveryOrder } from "../controllers/ShprocketIntergation/CreateOrderShiprocket.ts";

const route =  express.Router()


route.post("/create",createDeleveryOrder)



export default route