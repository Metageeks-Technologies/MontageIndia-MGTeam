export type MetaData = {
  format: string;
  size: number;
  length?: number;
  dimension?: string;
  dpi?: number;
  bitrate?: number;
  resolution?: string;
  frameRate?: string;
};
export type TProduct = {
  _id: string;
  uuid: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string[];
  publicKey: string;
  thumbnailKey: string;
  variants: {
    _id?: string;
    label?: string;
    price: number;
    credit: number;
    key: string;
  }[];
  status: "published" | "archived" | "unavailable" | "draft";
  mediaType: "image" | "video" | "audio";
  createdBy: string;
};

export type TCustomerProduct = {
  _id: string;
  uuid: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string[];
  publicKey: string;
  thumbnailKey: string;
  variants: {
    _id: string;
    label: string;
    price: number;
    credit: number;
    key?: string;
    metadata: MetaData;
  }[];
  status: "published";
  mediaType: "image" | "video" | "audio";
  length?: number;
  createdBy: string;
  isWhitelisted: boolean;
  isInCart: boolean;
  isPurchased: boolean;
};
