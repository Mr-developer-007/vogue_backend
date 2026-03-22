import type { Request, Response } from "express";
import Collection from "../models/collectionModel.ts";
import { deleteImage } from "../helpers/deleteImags.ts";

export const createCollection = async (req: Request, res: Response) => {
  try {
    const { title, des, color } = req.body;

      if (!title || !des || !color) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and color are required"
      });
    }


const image =  req.file
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const collection = await Collection.create({
      title,
      slug,
      des,
      color,
      image:image?.path,
      
    });

    res.status(201).json({
      success: true,
      data: collection,
      message:"Collection Created"
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections = await Collection
      .find()
     
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const upDateCollaction= async(req:Request,res:Response)=>{
  try {

const {id} = req.params;
const collection = await Collection.findById(id)
if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

        const { title, des, color } = req.body;

    collection.title = title;
    collection.des = des;
    collection.color = color;
 
   if(req.file){
 if (collection.image) {
        await deleteImage(collection.image);
      }   
       collection.image= req.file.path
   }
   await collection.save()
return res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      data: collection,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message:  "Server error",
    });
  }
}

export const toggleCollection = async(req:Request,res:Response)=>{
  try {

    const {id} = req.params;
const collection = await Collection.findById(id)
if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    collection.status = !collection.status;
    await collection.save()
    return res.status(200).json({
      success: true,
      message: "Collection updated successfully",
     
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message:  "Server error",
    });
  }
}



export const getSingleCollection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id)
      .populate({
        path: "products",
        select: "title images slug price",
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: collection,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getColl = async(req:Request,res:Response)=>{
   try {
    const collections = await Collection
      .find({status:true})
      // .populate("products")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


export const deleteCollection =async(req:Request,res:Response)=>{
try {
  const id = req.params.id
  const collection = await Collection.findById(id);
  if(!collection){
        return res.status(404).json({
        success: false,
        message: "Collection not found",
      });

  }



  await deleteImage(collection?.image as string)

await collection.deleteOne()
 return res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  
} catch (error) {
  return res.status(500).json({
    success:false,
    message:error

  })
}
}

export const AddProduct= async(req:Request,res:Response)=>{
  try {
       const {id} = req.params;
       const {productid}= req.body
const collection = await Collection.findById(id)
if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }
    const alreadyExists = collection.products.some(
      (p: any) => p.toString() === productid
    );
 if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in collection",
      });
    }
collection.products.push(productid)
   await collection.save() 
 return res.status(200).json({
      success: true,
      message: "Product added successfully",
      
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


export const removeProduct= async(req:Request,res:Response)=>{
  try {
       const {id} = req.params;
       const {productid}= req.body
const collection = await Collection.findById(id)
if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }
    const alreadyExists = collection.products.filter(
      (p: any) => p.toString() != productid
    );

collection.products=alreadyExists
   await collection.save() 
 return res.status(200).json({
      success: true,
      message: "Product remove successfully",
      
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

