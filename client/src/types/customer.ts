export type TCustomer = Document & {
    username: string;
    email: string;
    name: string; // Customer's full name
    password: string;
    isDeleted: boolean;
    credits: number;
    creditsValidity: string ;
    cart: []; // References to products in the cart
    subscription: string; // References to subscription
    purchaseHistory?: []; // References to orders
    subscriptionHistory?: []; // References to subscriptions
    phone?: string;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Number | undefined;
    }