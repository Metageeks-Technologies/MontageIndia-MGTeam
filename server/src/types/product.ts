import mongoose, { Document } from "mongoose";
export type TProduct = Document & {
    uuid:string;
    slug:string;
    title: string;
    description: string;
    tags: string[];
    category:string[];
    publicKey: string;
    thumbnailKey:String;
    variants: {
        _id?: mongoose.Types.ObjectId
        label?: string;
        price?: number;
        credit?: number;
        size:string;
        key: string;

    }[];
    status: "published" | "archived" | "unavailable" | "draft";
    mediaType: "image" | "video" | "audio";
    createdBy: mongoose.Types.ObjectId;
}

export type TEmcMedia = {
    uuid:string,
    product:mongoose.Types.ObjectId,
    mainJobId:string,
    watermarkJobId:string,
}