import express from "express"
import { verifyUser } from "../middlewere/verifyUserMiddlewere.ts"
import { getWishlist, removeFromWishList } from "../controllers/wishlistController.ts";

const route = express.Router()

route.post("/get",getWishlist)



export default route;
