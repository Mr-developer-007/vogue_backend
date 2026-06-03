import type { Request, Response, NextFunction } from "express";
import Video from "../models/videoModel.ts";
import path from "path";
import fs from "fs";


export const createVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const video = await Video.create({
      video: req.file.filename,
      product, 
    });

    return res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    next(error);
  }
};





export const watchVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const videoPath = path.join(
      process.cwd(),
      "uploads/videos",
      video.video
    );

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;

      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(videoPath, {
        start,
        end,
      });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      stream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });

      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    next(error);
  }
};




export const GetAllvideos = async(req: Request,
  res: Response,
  next: NextFunction)=>{
try {

  const allvideo = await Video.find().populate({path:"product",select:"title slug sellingPrice"}) .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: allvideo.length,
      videos: allvideo,
    });
} catch (error) {
  next(error)
}






}




export const deleteVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // uploads/videos/filename.mp4
    const filePath = path.join(
      process.cwd(),
      "uploads",
      "videos",
      video.video
    );

    // Delete file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await video.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};