import express from "express"
import { addToCart, addtoWishlist, deletCartitem, deletCartitems, getCartItem, itemDecrement, itemIncremant } from "../controllers/cartController.ts"
import { verifyUser } from "../middlewere/verifyUserMiddlewere.ts"
const route = express.Router()


route.post("/addproduct",verifyUser,addToCart)
route.get("/get",verifyUser,getCartItem)
route.put("/increment/quantity/:id",verifyUser,itemIncremant)
route.put("/decrement/quantity/:id",verifyUser,itemDecrement)
route.put("/movetowishlist/:id",verifyUser,addtoWishlist)

route.delete("/delete/:id",verifyUser,deletCartitem)
route.delete("/delete",verifyUser,deletCartitems)



export default route