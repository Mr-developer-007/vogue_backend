// uploadCollection
import express from "express"
import { verifyAdmin } from "../middlewere/verifyMiddlewere.ts"
import { AddProduct, createCollection, deleteCollection, getColl, getCollections, getSingleCollection, removeProduct, toggleCollection, upDateCollaction } from "../controllers/collectionController.ts"
import { uploadCollection } from "../helpers/uploadsImages.ts"

const route = express.Router()

route.post("/create",verifyAdmin,uploadCollection.single("image"),createCollection)
route.get("/get-all",verifyAdmin,getCollections)
route.put("/update/:id",verifyAdmin,uploadCollection.single("image"),upDateCollaction)
route.patch("/toggle-status/:id",verifyAdmin,toggleCollection)
route.get("/getcollection",getColl)
route.get("/getsinglecoll/:id",getSingleCollection)
route.delete("/delete/:id",verifyAdmin,deleteCollection)
route.put("/addProduct/:id",AddProduct);
route.put("/removeProduct/:id",removeProduct);


export default route