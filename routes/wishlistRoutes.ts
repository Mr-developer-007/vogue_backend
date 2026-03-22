import express from "express"
import { verifyUser } from "../middlewere/verifyUserMiddlewere.ts"
import { getWishlist, removeFromWishList } from "../controllers/wishlistController.ts";

const route = express.Router()

route.get("/get",verifyUser,getWishlist)
route.put("/remove/:id",verifyUser,removeFromWishList)


export default route;
