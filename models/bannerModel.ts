import { Document, model, Schema } from "mongoose";
export interface IBanner extends Document {
    tag: string;
    title: string;
    des: string;
    imagedesktop: string;
    imagemobile: string;
    status: boolean;
}

const bannerSchema = new Schema<IBanner>(
    {
        tag: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        des: {
            type: String,
            required: true,
            trim: true,
        },
        imagedesktop: {
            type: String,
            required: true,
            trim: true,
        },
        imagemobile: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Banner = model<IBanner>("banners", bannerSchema);
export default Banner;