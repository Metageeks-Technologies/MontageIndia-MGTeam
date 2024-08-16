import mongoose,{ Document } from "mongoose";

export type TAdmin = Document & {
    name: string;
    username:string;
    email: string;
    password?: string;
    role: 'superadmin' | 'admin';
    category: [string] ;
    mediaType: [string] ;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Number | undefined;
    isDeleted: Boolean;
    createJWT(): string;
    comparePassword(givenPassword: string): Promise<boolean>;
}
interface IProductItem {
    product: mongoose.Types.ObjectId;
    variantId: string[];
}

interface purchasedProducts {
    productId: mongoose.Types.ObjectId;
    variantId: string[];
}

export type TCustomer = Document & {
    username: string;
    email: string;
    name: string; // Customer's full name
    password: string;
    isDeleted: boolean;
    purchasedProducts: purchasedProducts[];
    cart: IProductItem[]; // References to products in the cart
    subscription: {
        subscriptionId:string;
        PlanId: string;
        credits: number;
        planValidity: Date;
    } // References to subscription
    purchaseHistory?: mongoose.Types.ObjectId[]; // References to orders
    subscriptionHistory?: mongoose.Types.ObjectId[]; // References to subscriptions
    phone?: string;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Number | undefined;
    createJWT(): string;
    comparePassword(givenPassword: string): Promise<boolean>;
}