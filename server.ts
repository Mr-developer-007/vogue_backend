import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";


import userRouter from "./routes/userRoutes.ts"
import categoryRouter from "./routes/categoryRoutes.ts"
import collectionRouter from "./routes/collectionRoutes.ts"
import productRouter from "./routes/productRoutes.ts"
import cartRouter from "./routes/cartRoutes.ts"
import wishListRouter from "./routes/wishlistRoutes.ts"
import addressRouter from "./routes/addressRoutes.ts"
import orderRouter from "./routes/orderRoutes.ts"


import cors from "cors";
import cookieParser from "cookie-parser"
import path from "path";
import { connectRedis } from "./helpers/redisConfig.ts";
dotenv.config()

const app = express()
app.use(cors({
    origin:[process.env.FRONTEND_URL as string ],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials:true
}))
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use(cookieParser())
const PORT = process.env.PORT || 8001
app.use(express.json());

app.get("/",async(req,res)=>{

  return res.json({server:"running..."})  
})





app.use("/api/v1/user",userRouter)
app.use("/api/v1/category",categoryRouter)
app.use("/api/v1/collection",collectionRouter)
app.use("/api/v1/products",productRouter)




app.use("/api/v1/cart",cartRouter)
app.use("/api/v1/wishlist",wishListRouter)
app.use("/api/v1/address",addressRouter)
app.use("/api/v1/order",orderRouter)









mongoose.connect(process.env.DB_URL as string).then(()=>{
app.listen(PORT,()=>{
  connectRedis()
    console.log(`http://localhost:${PORT}`)
})
})

