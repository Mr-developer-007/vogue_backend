import type { Request, Response } from "express";
import Product from "../models/productModel.ts";
import { deleteImage } from "../helpers/deleteImags.ts";
import Category from "../models/categoryModel.ts";


export const createProduct = async (req: Request, res: Response) => {
  try {
const files = req.files as {
  [fieldname: string]: Express.Multer.File[];
};
const thumbnailFile = files?.thumbnail?.[0];
const filesImage = files?.images || [];
   
    const {
      title,
      sku,
      costPrice,
      sellingPrice,
      compareAtPrice,
      quantity,
      description,
      shortDescription,
      productfor,
      status,
      isFeatured,
      isBestSeller,
      isNewArrival,
      color,
    } = req.body;

    const alreadySku = await Product.findOne({ sku });

    if (alreadySku) {
      if (filesImage.length > 0) {
        await Promise.all(
          filesImage.map((file) => deleteImage(file.path))
        );
deleteImage(thumbnailFile.path)

      }

      return res.status(409).json({
        success: false,
        message: "SKU already exists",
      });
    }

    // ===============================
    // SLUG
    // ===============================
    const slug =
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") + `-${sku}`;



    const features = req.body.features
      ? req.body.features
      : [];

    const categories = req.body.categories
      ? req.body.categories
      : [];

    const tags = req.body.tags ? req.body.tags : [];

    const size = req.body.size ? req.body.size : [];


    let specifications = new Map<string, string>();

    if (req.body.specifications) {
      for (const [key, value] of Object.entries(req.body.specifications)) {
        specifications.set(key, String(value));
      }
    }


    const seo = {
      metaTitle: req.body["seo"]?.metaTitle || "",
      metaDescription: req.body["seo"]?.metaDescription || "",
      keywords: req.body["seo"]?.keywords
        ? req.body["seo"].keywords
        : [],
    };

    const shipping = {
      weight: Number(req.body["shipping"]?.weight || 0),
      isFreeShipping: req.body["shipping"]?.isFreeShipping === "true",
      dimensions: {
        length: Number(req.body["shipping"]?.dimensions?.length || 0),
        width: Number(req.body["shipping"]?.dimensions?.width || 0),
        height: Number(req.body["shipping"]?.dimensions?.height || 0),
      },
    };


    const images = filesImage.map((file) => file.path);

    const product = await Product.create({
      title,
      slug,
      sku,
      costPrice,
      sellingPrice,
      compareAtPrice,
      quantity,
      description,
      shortDescription,
      productfor,
      status,
      size,
      isFeatured: isFeatured === "true",
      isBestSeller: isBestSeller === "true",
      isNewArrival: isNewArrival === "true",
     thumbnail:thumbnailFile.path,
      features,
      categories,
      tags,
      specifications,
      seo,
      shipping,
      images,
      color
    });



    if (categories.length > 0) {
      await Promise.all(
        categories.map(async (categoryId: string) => {
          await Category.findByIdAndUpdate(
            categoryId,
            { $addToSet: { product: product._id } },
            { new: true }
          );
        })
      );
    }


    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {


   const files = req.files as {
  [fieldname: string]: Express.Multer.File[];
};
const thumbnailFile = files?.thumbnail?.[0];
const filesImage = files?.images || [];

    if (filesImage.length > 0) {
      await Promise.all(
        filesImage.map((file) => deleteImage(file.path))
      );
    }
    deleteImage(thumbnailFile.path)

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "15",
      category,
      minPrice,
      maxPrice,
      sort,
      search,
    } = req.query;


    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;

    const filter: any = {};
    if (category) {
      filter.categories = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.sellingPrice = {};
      if (minPrice) filter.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) filter.sellingPrice.$lte = Number(maxPrice);
    }

    let sortOption: any = { createdAt: -1 }; // default newest

    if (sort === "price_asc") {
      sortOption = { sellingPrice: 1 };
    } else if (sort === "price_desc") {
      sortOption = { sellingPrice: -1 };
    }
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize).select("title slug  sellingPrice thumbnail compareAtPrice shortDescription productfor");

    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      page: pageNumber,
      totalPages: Math.ceil(totalProducts / pageSize),
      totalProducts,
      count: products.length,
      products,
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
}


export const getProductByFeatured = async (req: Request, res: Response) => {
  try {
    const { isFeatured } = req.params;

    let flag: "isFeatured" | "isBestSeller" | "isNewArrival";

    switch (isFeatured) {
      case "isFeatured":
        flag = "isFeatured";
        break;
      case "isBestSeller":
        flag = "isBestSeller";
        break;
      case "isNewArrival":
        flag = "isNewArrival";
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid featured type",
        });
    }

    const products = await Product.find({
      status: "active",
      [flag]: true,
    }).sort({ createdAt: -1 }).limit(8).select("color categories title slug thumbnail sellingPrice compareAtPrice shortDescription productfor").populate("categories");

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug,
      // status: "active",
    })
      .populate("categories")
      .exec();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("getSingleProduct error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getSingleProductForEdit = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug,
      // status: "active",
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("getSingleProduct error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const parseJSON = <T>(value: unknown, fallback: T): T => {
  if (!value) return fallback;

  if (typeof value === "object") {
    return value as T;
  }

  try {
    return JSON.parse(value as string) as T;
  } catch {
    return fallback;
  }
};

export const updateProduct = async ( req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const updates = {
      title: req.body.title as string,
      sku: req.body.sku as string,

      costPrice: Number(req.body.costPrice),
      sellingPrice: Number(req.body.sellingPrice),
      compareAtPrice: Number(req.body.compareAtPrice),
      quantity: Number(req.body.quantity),

      description: req.body.description as string,
      shortDescription: req.body.shortDescription as string,
      productfor: req.body.productfor as string,
      status: req.body.status as string,
      color: req.body.color as string,

      isFeatured: req.body.isFeatured === "true",
      isBestSeller: req.body.isBestSeller === "true",
      isNewArrival: req.body.isNewArrival === "true",
      
      specifications: parseJSON<Record<string, string>>(
        req.body.specifications,
        {}
      ),
      features: parseJSON<string[]>(req.body.features, []),
      categories: parseJSON<string[]>(req.body.categories, []),
      tags: parseJSON<string[]>(req.body.tags, []),
      size: parseJSON<string[]>(req.body.size, []),
      seo: parseJSON<Record<string, unknown>>(req.body.seo, {}),
      shipping: parseJSON<Record<string, unknown>>(req.body.shipping, {}),
    };

    // 🔹 Handle deleted images (IMPORTANT FIX)
    const deleteImages = parseJSON<string[]>(req.body.deleteImages, []);

    if (deleteImages.length) {
      await Promise.all(
        deleteImages.map(async (img: string) => {
          await deleteImage(img);
        })
      );

      product.images = product.images.filter(
        (img: string) => !deleteImages.includes(img)
      );
    }
    const files = req.files as {
  [fieldname: string]: Express.Multer.File[];
};

    // 🔹 Handle new images (multer)
    if (req.files && Array.isArray(files.images)) {
      const newImages = files.images.map(
        (file) => file.path
      );
      product.images.push(...newImages);
    }


if(files.newthumbnail){
  if(product.thumbnail){
    await deleteImage(product.thumbnail)
  }

  product.thumbnail = files.newthumbnail[0].path;

}

 
    Object.assign(product, updates);
    await product.save();

    return res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};


export const searchProduct = async (req: Request, res: Response)=>{
  try {
     const { search } = req.query;


 const products = await Product.find({
      $or: [
        { title: { $regex: search, $options: "i" } }, 
        { tags: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    } as any).limit(20).select("title slug");

 return res.status(200).json({
      success: true,
      data: products,
    });


  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}


export const deleteProduct = async(req: Request, res: Response )=>{
try {
  const id = req.params.id;
   
  const product = await Product.findById(id);

  if(!product){
    return res.status(404).json({
        success: false,
        message: "Product not found",
      });
  }

  for (let i = 0 ;i < product.images.length; i++){
    await deleteImage(product.images[i] )
  }

if(product.thumbnail){
 await deleteImage(product.thumbnail )

}

  await product.deleteOne()

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
} catch (error) {
  
    return res.status(500).json({
      success: false,
      message: error,
    });
}
}


