import mongoose, { Document, model, Schema } from "mongoose";


interface IAddress extends Document {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    label: 'Home' | 'Work' | 'Other';
    isDefault: Boolean;
    user: mongoose.Schema.Types.ObjectId
}


const addressSchema = new Schema<IAddress>({

    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required for delivery']
    },


    street1: {
        type: String,
        required: [true, 'Street address is required']
    },
    street2: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    state: {
        type: String,
        required: [true, 'State/Province is required']
    },
    zipCode: {
        type: String,
        required: [true, 'Zip/Postal code is required']
    },
    country: {
        type: String,
        required: true,
        default: 'India'
    },

    label: {
        type: String,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home'
    }, 
    isDefault: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const Address = model<IAddress>("address", addressSchema)

export default Address


