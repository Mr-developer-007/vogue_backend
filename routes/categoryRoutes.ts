import express from "express"
import { verifyAdmin } from "../middlewere/verifyMiddlewere.ts"
import { createCategory, deleteCategory, editCategory, getCategory, getCategoryUser } from "../controllers/categoryController.ts"
import { uploadCategory } from "../helpers/uploadsImages.ts"

const route = express.Router()


route.post("/create",verifyAdmin,uploadCategory.single("image"),createCategory)
route.get("/get",verifyAdmin,getCategory)
route.put("/update/:id",verifyAdmin,uploadCategory.single("image"),editCategory)
route.delete("/delete/:id",verifyAdmin,deleteCategory)

route.get("/user/get",getCategoryUser)

export default route