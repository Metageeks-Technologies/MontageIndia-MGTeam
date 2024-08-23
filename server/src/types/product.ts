import mongoose, { Document } from "mongoose";
type MetaData = {
  format: string;
  size: string;
  length?: string;
  dimension?: string;
  dpi?: string;
};
export type TProduct = Document & {
  _id: string;
  uuid: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string[];
  publicKey: string;
  thumbnailKey: String;
  variants: {
    _id?: mongoose.Types.ObjectId;
    label?: string;
    price?: number;
    credit?: number;
    key: string;
    metadata: MetaData;
  }[];
  status: "published" | "archived" | "unavailable" | "draft";
  mediaType: "image" | "video" | "audio";
  createdBy: mongoose.Types.ObjectId;
};

export type TEmcMedia = {
  uuid: string;
  product: mongoose.Types.ObjectId;
  mainJobId: string;
  watermarkJobId: string;
};
