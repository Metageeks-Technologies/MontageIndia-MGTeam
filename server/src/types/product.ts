import mongoose, { Document } from "mongoose";
export type MetaData = {
  format: string;
  size: number;
  length?: number;
  dimension?: string;
  dpi?: number;
  bitrate?: number;
  resolution?: string;
  frameRate?: number;
};
export type TProduct = Document & {
  _id: string;
  uuid: string;
  displayId: string;
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
  length?: number;
  height?: number;
  width?: number;
  createdBy: mongoose.Types.ObjectId;
};

export type TEmcMedia = {
  uuid: string;
  product: mongoose.Types.ObjectId;
  mainJobId: string;
  watermarkJobId: string;
};
