import mongoose, { Document } from "mongoose";
export type TProduct = Document & {
    uuid:string;
    slug:string;
    title: string;
    description: string;
    tags: string[];
    category:string;
    publicKey: string;
    thumbnailKey:String;
    variants: {
        label?: string;
        price?: number;
        size:string;
        key: string;
    }[];
    status: "published" | "archived" | "unavailable" | "draft";
    mediaType: "image" | "video" | "audio";
    createdBy: mongoose.Types.ObjectId;

}