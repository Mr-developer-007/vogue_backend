import type { Request, Response } from "express";
import Category from "../models/categoryModel.ts";
import { deleteImage } from "../helpers/deleteImags.ts";
import { redisClient } from "../helpers/redisConfig.ts";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // check unique title
    const existingCategory = await Category.findOne({
      title: { $regex: `^${title}$`, $options: "i" }, 
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category title already exists",
      });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const category = await Category.create({
      title,
      slug,
      image: req.file.path, // single image
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // delete image if exists
    if (category.image) {
      await deleteImage(category.image);
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

export const editCategory= async (req:Request ,res:Response)=>{
  try {
    const {id} = req.params;
    const {title} = req.body
    const image = req.file

    const category = await Category.findById(id);
     if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
     if (title) {
      category.title = title;
    }

    if (image) {
      if (category.image) {
        await deleteImage(category.image);
      }
      category.image = image.path;
    }
    await category.save()

 return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Failed to update category",
    }); 
  }
}


export const getCategoryUser = async (req: Request, res: Response) => {
  try {
const key = "category";

const data =  await redisClient.get(key)

// if(data){
//   return   res.status(200).json({
//       success: true,
//       data:JSON.parse(data),
//     });
// }



    const categories = await Category.find();

    await redisClient.set(key,JSON.stringify(categories),{
      EX: 60 * 10,
    })
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};





