import { Document, model, Schema } from "mongoose";

export interface ICategory extends Document{
    title:string;
    slug:string;
    image:string;
    product:Schema.Types.ObjectId[];
}

const categorySchema = new Schema<ICategory>({
    title:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
       type:String,
        required:true,
        unique:true   
    },
    image:{
          type:String,
        required:true,
    },
    product:[
        {type:Schema.Types.ObjectId,
            ref:"Product"
        }
    ]
},{timestamps:true})


const Category = model<ICategory>("categories",categorySchema);

export default Category;