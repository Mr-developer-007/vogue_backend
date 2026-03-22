import express from "express"
import { verifyAdmin } from "../middlewere/verifyMiddlewere.ts"
import { uploadProduct } from "../helpers/uploadsImages.ts"
import { createProduct, deleteProduct, getProduct, getProductByFeatured, getSingleProduct, getSingleProductForEdit, searchProduct, updateProduct } from "../controllers/productController.ts"
const route = express.Router()


route.post("/create",verifyAdmin,uploadProduct.array("images",10),createProduct)
route.get("/get",getProduct)
route.get("/get/:isFeatured",getProductByFeatured)
route.get("/foredit/:slug",getSingleProductForEdit)
route.get("/search",searchProduct)


route.get("/:slug",getSingleProduct)
route.put("/update/:id",verifyAdmin,uploadProduct.array("images",10),updateProduct)

route.delete("/delete/:id",verifyAdmin,deleteProduct)

export default route