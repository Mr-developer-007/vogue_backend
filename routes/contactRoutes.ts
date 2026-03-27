import express  from "express"
import { AddtoContact, deleteContact, getAllContact } from "../controllers/ContactController.ts"
import { verifyAdmin } from "../middlewere/verifyMiddlewere.ts"

const route =  express.Router()
route.post("/add",AddtoContact)
route.get("/get_all",verifyAdmin,getAllContact)
route.delete("/delete/:id",verifyAdmin,deleteContact)
export default route