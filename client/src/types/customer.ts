import mongoose from "mongoose";
export interface ProductItem {
  productId: string;
  variantId: string;
}

interface Subscription {
  subscriptionId: string;
  PlanId: mongoose.Types.ObjectId;
  credits: number;
  planValidity: string;
  status: string;
}

export type TCustomer = {
  uid: string;
  id: string;
  image: string;
  email: string;
  name: string; // Customer's full name
  password: string;
  isDeleted: boolean;
  purchasedProducts: ProductItem[];
  cart: ProductItem[]; // References to products in the cart
  wishlist: ProductItem[]; // References to products in the wishlist
  subscription: Subscription; // References to subscription
  purchaseHistory?: string[]; // References to orders
  subscriptionHistory?: string[]; // References to subscriptions
  phone?: string;
  resetPasswordToken?: string | undefined;
  resetPasswordExpires?: Number | undefined;
  createJWT(): string;
  comparePassword(givenPassword: string): Promise<boolean>;
};


export type UserSubscription={
  name:string,
  username:string,
  email:string,
  image:string,
  subscription:{
    PlanId:{
      item:{
        name:string
      }
    },
    credits:number,
    planValidity:string,
    status:string
  }
}