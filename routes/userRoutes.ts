import express from "express"
import { adminLogout, CreateAdmin, createUserByGoogle, getAdmin, getUser, LoginAdmin, loginUser, sendOtp, verifyOtp } from "../controllers/userController.ts"
import { verifyAdmin } from "../middlewere/verifyMiddlewere.ts"
import { verifyUser } from "../middlewere/verifyUserMiddlewere.ts"
const route = express.Router()


route.post("/admin/create",CreateAdmin)
route.post("/admin/login",LoginAdmin)
route.get("/admin/verify",verifyAdmin,getAdmin)
route.get("/admin/logout",adminLogout)


route.post("/user/login",loginUser)


route.post("/user/sendotp",sendOtp)
route.post("/user/verifyotp",verifyOtp)
route.post("/register/google",createUserByGoogle)

route.get("/user/get",verifyUser,getUser)



export default route