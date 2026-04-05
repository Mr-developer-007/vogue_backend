import type { Request, Response } from "express";
import Blog from "../models/blogModel.ts";

export const CreateBlog = async (req: Request, res: Response) => {
  try {
    const { title, shortdes, des, type } = req.body;
    const image = req.file?.path;

    if (!title || !shortdes || !des || !type) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Clean slug (SEO friendly)
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, "") // remove special chars
      .replace(/\s+/g, "-"); // spaces → dash

    // ✅ Check duplicate (by title or slug)
    const alreadyBlog = await Blog.findOne({
      $or: [{ title }, { slug }],
    });

    if (alreadyBlog) {
      return res.status(409).json({
        success: false,
        message: "Blog already exists",
      });
    }

    // ✅ Create blog
    const newBlog = await Blog.create({
      title,
      shortdes,
      des,
      type,
      image,
      slug,
    });

    // ✅ Success response
    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });

  } catch (error: any) {
    console.error("CreateBlog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;

    let query = Blog.find().sort({ createdAt: -1 });

   
    if (limit) {
      query = query.limit(Number(limit));
    }

    const blogs = await query;

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });

  } catch (error: any) {
    console.error("getBlog error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getSingleBlog = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // ✅ Validation
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    // ✅ Find blog
    const blog = await Blog.findOne({ slug });

    // ❌ Not found
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // ✅ Success
    return res.status(200).json({
      success: true,
      data: blog,
    });

  } catch (error: any) {
    console.error("getSingleBlog error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};