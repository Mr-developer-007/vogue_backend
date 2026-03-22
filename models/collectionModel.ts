import { Document, model, Schema } from "mongoose";

export interface ICollection extends Document{
    title:string;
    slug:string;
    des:string;
    color:string;
    image:string;
   
    status:boolean;
    products:Schema.Types.ObjectId[]
}


const collectionSchema =  new Schema<ICollection>({
title:{
    type:String,
    required:true,
    trim:true,
    unique:true,
},
slug:{
    type:String,
    required:true,
    unique:true,
    trim:true
},
des:{
    type:String,
    required:true,
    trim:true
},
color:{
 type:String,
    required:true,
    trim:true
},
image:{
    type:String,
    required:true,
    trim:true
},

status:{type:Boolean,default:true},
products:[
     {type:Schema.Types.ObjectId,
    ref:"Product"
}    
]


},{timestamps:true});


const Collection = model<ICollection>("collections",collectionSchema);
export default Collection;