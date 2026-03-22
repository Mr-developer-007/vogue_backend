import express  from "express"
import { createAddress, deletAddress, getAddress, setDefault } from "../controllers/addressController.ts"
import { verifyUser } from "../middlewere/verifyUserMiddlewere.ts"
const route =  express.Router()


route.post("/addnew",verifyUser,createAddress as any)
route.get("/all",verifyUser,getAddress as any)
route.delete("/delete/:id",verifyUser,deletAddress as any)
route.put("/setdefault/:id",verifyUser,setDefault as any)



export default route