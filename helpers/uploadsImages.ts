import multer from "multer"
import path from "path"
import crypto from "crypto"
import fs from "fs"




const storageBanner = multer.diskStorage({
  destination: (req, file, cb) => {
const BannerPath = path.join(process.cwd(),"uploads","banners")
if(!fs.existsSync(BannerPath)){
  fs.mkdirSync(BannerPath)
}
    cb(null, "uploads/banners") 
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`
    cb(null, uniqueName)
  },
})

export const uploadBanner = multer({ storage:storageBanner })


const storageCategory = multer.diskStorage({
  destination: (req, file, cb) => {
const CategoryPath = path.join(process.cwd(),"uploads","category")
if(!fs.existsSync(CategoryPath)){
  fs.mkdirSync(CategoryPath)
}
    cb(null, "uploads/category") 
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`
    cb(null, uniqueName)
  },
})


export const uploadCategory = multer({ storage:storageCategory })



const storageCollection = multer.diskStorage({
  destination: (req, file, cb) => {
const CollectionPath = path.join(process.cwd(),"uploads","collection")
if(!fs.existsSync(CollectionPath)){
  fs.mkdirSync(CollectionPath)
}
    cb(null, "uploads/collection") 
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`
    cb(null, uniqueName)
  },
})


export const uploadCollection = multer({ storage:storageCollection })


const productCollection = multer.diskStorage({
  destination: (req, file, cb) => {
const CollectionPath = path.join(process.cwd(),"uploads","product")
if(!fs.existsSync(CollectionPath)){
  fs.mkdirSync(CollectionPath)
}
    cb(null, "uploads/product")  
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`
    cb(null, uniqueName)
  },
})


export const uploadProduct = multer({ storage:productCollection })
