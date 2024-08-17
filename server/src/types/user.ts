import mongoose, { Document } from "mongoose";
import type { ProductItem } from "@src/model/product/order";

export interface purchasedProductItem {
  productId: mongoose.Schema.Types.ObjectId;
  variantId: string[];
}

export type TAdmin = Document & {
  name: string;
  username: string;
  email: string;
  password?: string;
  role: "superadmin" | "admin";
  category: [string];
  mediaType: [string];
  resetPasswordToken?: string | undefined;
  resetPasswordExpires?: Number | undefined;
  isDeleted: Boolean;
  createJWT(): string;
  comparePassword(givenPassword: string): Promise<boolean>;
};

export type TCustomer = Document & {
  username: string;
  email: string;
  name: string; // Customer's full name
  password: string;
  isDeleted: boolean;
  purchasedProducts: purchasedProductItem[];
  cart: ProductItem[]; // References to products in the cart
  wishlist: ProductItem[]; // References to products in the wishlist
  subscription: {
    subscriptionId: string;
    PlanId: string;
    credits: number;
    planValidity: Date;
  }; // References to subscription
  purchaseHistory?: mongoose.Types.ObjectId[]; // References to orders
  subscriptionHistory?: mongoose.Types.ObjectId[]; // References to subscriptions
  phone?: string;
  resetPasswordToken?: string | undefined;
  resetPasswordExpires?: Number | undefined;
  createJWT(): string;
  comparePassword(givenPassword: string): Promise<boolean>;
};
