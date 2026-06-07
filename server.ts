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
import ContactRouter from "./routes/contactRoutes.ts"
import CouponcodeRoute from "./routes/couponCodeRoutes.ts"
import BlogRoute from "./routes/blogRoutes.ts"
import ShipmentRoute from "./routes/Shiprocket.ts"
import VideoRoute from "./routes/videoRoutes.ts"
import reviewRoutes from "./routes/reviewRoutes.ts"


import cors from "cors";
import cookieParser from "cookie-parser"
import path from "path";
import { connectRedis } from "./helpers/redisConfig.ts";
import Product from "./models/productModel.ts";
dotenv.config()



const app = express()
app.use(cors({
    origin:process.env.FRONTEND_URL?.split(","),
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
app.use("/api/v1/contact",ContactRouter)
app.use("/api/v1/couponcode",CouponcodeRoute)
app.use("/api/v1/blog",BlogRoute)
app.use("/api/v1/review",reviewRoutes)



app.use("/api/v1/cart",cartRouter)
app.use("/api/v1/wishlist",wishListRouter)
app.use("/api/v1/address",addressRouter)
app.use("/api/v1/order",orderRouter)

app.use("/api/v1/shipment",ShipmentRoute)


app.use("/api/v1/video",VideoRoute)







app.get("/product-feed.xml", async (req, res) => {
  try {
    const products = await Product.find({ status: "active" });

    const baseUrl = "https://thevoguewardrobe.com";

    let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>Vogue Wardrobe</title>
<link>${baseUrl}</link>
<description>Premium Fashion Collection</description>
`;

    products.forEach((product) => {
      xml += `
<item>
  <g:id>${product._id}</g:id>
  <g:title><![CDATA[${product.title}]]></g:title>
  <g:description><![CDATA[${product.description || ""}]]></g:description>
  <g:link>${baseUrl}/product/${product.slug}</g:link>
  <g:image_link>${baseUrl}/${product.images?.[0]}</g:image_link>
  <g:price>${product.sellingPrice} INR</g:price>
  <g:brand>Vogue Wardrobe</g:brand>
  <g:condition>new</g:condition>
</item>`;
    });

    xml += `
</channel>
</rss>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating feed");
  }
});





mongoose.connect(process.env.DB_URL as string).then(()=>{
app.listen(PORT,()=>{
  connectRedis()
    console.log(`http://localhost:${PORT}`)
})
})

