import { Schema } from "mongoose";



const blogSchema = new Schema({
    title:{type:String,
        required:true,
        trim:true
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
 }
 


})