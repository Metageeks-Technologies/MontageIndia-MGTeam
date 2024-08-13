export type TProduct =  {
    _id:string
    uuid:string;
    slug:string;
    title: string;
    description: string;
    tags: string[];
    category:string[];
    publicKey: string;
    thumbnailKey:string;
    variants: {
        _id?:string
        label?: string;
        price: number;
        size:string;
        key: string;
    }[];
    status: "published" | "archived" | "unavailable" | "draft";
    mediaType: "image" | "video" | "audio";
    createdBy:string;

}
export type Tcart={
    _id:string
    product:TProduct
    variantId:string
}