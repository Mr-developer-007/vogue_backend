import { Document, model, Schema } from "mongoose";


interface IVerify extends Document{
    email:string;
    otp:number;
    expiresAt:Date
}


const verifyUser= new Schema<IVerify>({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    
    otp:{
        type:Number,
        required:true
    },
    expiresAt:{
        type:Date,
        required: true
    }


},{
    timestamps:true
})


const Otp = model<IVerify>("otp",verifyUser)

export default Otp