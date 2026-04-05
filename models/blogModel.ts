import { Document, model, Schema } from "mongoose";


interface IBlog extends Document{
    title:string,
    slug:string,
    image:string,
    shortdes:string,
    des:string,
    type:string,


}


const blogSchema = new Schema<IBlog>({
    title:{type:String,
        required:true,
        trim:true,
         unique:true
    },

  slug:{type:String,
        required:true,
        trim:true,
        unique:true
    },
    image:{
      type:String,
        required:true,
       
    },
    shortdes:{
 type:String,
        required:true,
    },
 des:{
     type:String,
        required:true,
 },
 type:{
 type:String,
        required:true,
 }
 


})



const Blog = model<IBlog>("blog",blogSchema)

export default Blog