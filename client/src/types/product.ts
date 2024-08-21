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
    size: string;
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
    size: string;
    key?: string;
  }[];
  status: "published";
  mediaType: "image" | "video" | "audio";
  createdBy: string;
  isWhitelisted: boolean;
  isInCart: boolean;
  isPurchased: boolean;
};
