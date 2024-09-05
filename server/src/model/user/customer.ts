import mongoose, { Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as validator from "validator";
import type { TCustomer } from "../../types/user";
import config from "@src/utils/config";

const customerSchema = new mongoose.Schema<TCustomer>(
  {
    uid:{
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "please enter your name"],
      maxlength: [30, "name can't exceed 30 characters"],
      minlength: [4, "name should have more than 4 characters"],
      trim: true,
      default: "none",
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      unique: true,
      validate: [validator.isEmail, "please enter a valid email"],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required:false,
    },
    password: {
      type: String,
      minlength: [6, "password should have a minimum of 6 characters"],
      select: false,
    },
    isDeleted: { type: Boolean, default: false },
    resetPasswordToken: { type: String, default: undefined },
    resetPasswordExpires: { type: Number, default: undefined },
    purchasedProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        variantId: { type: String, required: true },
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        variantId: { type: String, required: true },
      },
    ],
    wishlist: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        variantId: { type: String, required: true },
      },
    ],
    subscription: {
      subscriptionId: { type: String },
      PlanId: { type: mongoose.Types.ObjectId,ref:'SubscriptionPlan' },
      credits: { type: Number, default: 100 },
      planValidity: { type: Date},
      status: { type: String, default: "active" },
    },
    purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  {
    timestamps: true,
  }
);

// Define model interface
interface CustomerModel extends Model<TCustomer> {}

// Hash the password before saving
customerSchema.pre<TCustomer>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    if (typeof this.password === "string") {
      this.password = await bcrypt.hash(this.password, salt);
    } else {
      throw new Error("Password is not defined");
    }
    next();
  } catch (err: any) {
    next(err);
  }
});

// Create JWT token
customerSchema.methods.createJWT = function (this: TCustomer) {
  if (!config.customerJwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment.");
  }
  return jwt.sign({ id: this._id }, config.customerJwtSecret, {
    expiresIn: config.jwtLifetime,
  });
};

// Compare password
customerSchema.methods.comparePassword = async function (
  this: TCustomer,
  givenPassword: string
) {
  if (this.password) {
    const isMatch = await bcrypt.compare(givenPassword, this.password);
    return isMatch;
  } else {
    throw new Error("Password is not defined or not available in this context");
  }
};

export default mongoose.model<TCustomer, CustomerModel>(
  "Customer",
  customerSchema
);
