import { Document, model, Schema } from "mongoose";

interface  IContact extends Document{
    name:string;
    email:string;
    phone:string;
    message:string;
    subject:string;

}

const ContactSchema = new Schema<IContact>({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
         type:String,
        required:true,
        trim:true,
    },
    phone:{
         type:String,
        trim:true,
    },
    subject:{
         type:String,
        trim:true,
    },
    message:{
         type:String,
        required:true,
        trim:true,
    }
},{
    timestamps:true
});


const Contact = model<IContact>("contact",ContactSchema)

export default Contact;