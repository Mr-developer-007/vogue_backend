import express from "express";
import {
  createVideo,
  deleteVideo,
  GetAllvideos,
  watchVideo,
  
} from "../controllers/videoController.ts";
import { uploadVideo } from "../helpers/videoUpload.ts";


const router = express.Router();

router.post(
  "/create",
  uploadVideo.single("video"),
  createVideo
);

router.get("/watch/:id", watchVideo);

router.get(
  "/getall",
  GetAllvideos
);

router.delete("/delete/:id",deleteVideo)

export default router;