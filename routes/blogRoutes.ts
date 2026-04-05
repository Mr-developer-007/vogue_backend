import express from "express";
import { CreateBlog, getBlog, getSingleBlog } from "../controllers/BlogController.ts";
import { verifyAdmin } from "../middlewere/verifyMiddlewere.ts";
import { uploadBlog } from "../helpers/uploadsImages.ts";
const route = express.Router();



route.post(`/create`,verifyAdmin,uploadBlog.single("image"),CreateBlog)
route.get("/get",getBlog)
route.get("/single/:slug",getSingleBlog)
export default route
