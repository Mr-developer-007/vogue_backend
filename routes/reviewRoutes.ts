import express  from "express"
import { CreateReview, deleteReview, getReview } from "../controllers/reviewController.ts"
import { verifyAdmin } from "../middlewere/verifyMiddlewere.ts"
const route =  express.Router()


route.post("/create",verifyAdmin,CreateReview)
route.delete("/delete/:id",verifyAdmin,deleteReview)
route.get("/get/:id",getReview)


export default route