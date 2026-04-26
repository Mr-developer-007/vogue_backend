import mongoose, { Schema } from "mongoose";





const reviewSchema= new Schema({
    name:{
        type:String,
        required:true,
    },
     message:{
        type:String,
        required:true,
    },
      place:{
        type:String,
        required:true,
    },
      product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Product"
    },
},{timestamps:true});

