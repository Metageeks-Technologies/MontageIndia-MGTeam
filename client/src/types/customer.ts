export interface purchasedProductItem {
  productId: string;
  variantId: string[];
}

export interface ProductItem {
  productId: string;
  variantId: string;
}

export type TCustomer = {
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
  purchaseHistory?: string[]; // References to orders
  subscriptionHistory?: string[]; // References to subscriptions
  phone?: string;
  resetPasswordToken?: string | undefined;
  resetPasswordExpires?: Number | undefined;
  createJWT(): string;
  comparePassword(givenPassword: string): Promise<boolean>;
};
