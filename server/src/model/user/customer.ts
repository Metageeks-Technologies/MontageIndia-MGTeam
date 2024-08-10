import mongoose, { Model } from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as validator from 'validator';
import type { TCustomer } from "../../types/user";

const customerSchema = new mongoose.Schema<TCustomer>({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxlength: [30, "name can't exceed 30 characters"],
    minlength: [4, "name should have more than 4 characters"],
    trim: true,
    default: "none"
  },
  username:{
    type: String,
    required: [true, "please enter your username"],
    maxlength: [30, "username can't exceed 30 characters"],
    minlength: [4, "username should have more than 4 characters"],
    trim: true,
    default: "none",
    unique: true,
  },
  email:{
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    validate: [validator.isEmail, "please enter a valid email"],
  },
  phone: { 
    type: String,
    minlength: [10, "phone number should have minimum 10 characters"],
    maxlength: [10, "phone number should have maximum 10 characters"],
    trim: true,
    default: "none",
  },
  password: {
    type: String,
    minlength: [6, "password should have a minimum of 6 characters"],
    select: false,
  },
  isDeleted: { type: Boolean, default: false },
  resetPasswordToken:{ type: String,default:undefined,},
  resetPasswordExpires:{ type: Number,default: undefined,},
  credits: { type: Number, default: 0 },
  creditsValidity: { type: String, default: '0'},
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' ,unique:true}],
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  subscriptionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' }],
},{
  timestamps: true
});

// Define model interface
interface CustomerModel extends Model<TCustomer> { }

// Hash the password before saving
customerSchema.pre<TCustomer>('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        if (typeof this.password === 'string') {
            this.password = await bcrypt.hash(this.password, salt);
        } else {
            throw new Error('Password is not defined');
        }
        next();
    } catch (err:any) {
        next(err);
    }
});

// Create JWT token
customerSchema.methods.createJWT = function (this: TCustomer) {
    if (!process.env.JWT_SECRET_CUSTOMER) {
        throw new Error("JWT_SECRET is not defined in the environment.");
    }
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_CUSTOMER, { expiresIn: process.env.JWT_LIFETIME });
};

// Compare password
customerSchema.methods.comparePassword = async function (this: TCustomer, givenPassword: string) {
    if (typeof this.password === 'string') {
        const isMatch = await bcrypt.compare(givenPassword, this.password);
        return isMatch;
    } else {
        throw new Error('Password is not defined');
    }
};

export default mongoose.model<TCustomer, CustomerModel>('Customer', customerSchema);
