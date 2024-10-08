import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Model } from "mongoose";
import * as validator from 'validator';
import type { TAdmin } from "../../types/user";
import config from "@src/utils/config";
// Define the schema

const adminsSchema = new mongoose.Schema<TAdmin>({
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
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        validate: [validator.isEmail, "please enter a valid email"],
    },
    password: {
        type: String,
        minlength: [6, "password should have a minimum of 6 characters"],
        select: false,
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin'],
        default: 'admin',
    },
    mediaType: {
        type: [String],
        required: true,
        default: ["all"],
    },
    category: {
        type: [String],
        // required: true,
        default: ["all"]
    },
    resetPasswordToken:{
        type: String,
        default:undefined,
    },
    resetPasswordExpires:{
        type: Number,
        default: undefined,
    },
    isDeleted:{
        type: Boolean,
        default: false
    }

},
    { timestamps: true }
);

// Define model interface
interface AdminModel extends Model<TAdmin> { }

// Hash the password before saving
adminsSchema.pre<TAdmin>('save', async function (next) {
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
adminsSchema.methods.createJWT = function (this: TAdmin) {
    if (!config.jwtSecret) {
        throw new Error("JWT_SECRET is not defined in the environment.");
    }
    return jwt.sign({ id: this._id }, config.jwtSecret, { expiresIn: config.jwtLifetime });
};

// Compare password
adminsSchema.methods.comparePassword = async function (this: TAdmin, givenPassword: string) {
    if (typeof this.password === 'string') {
        const isMatch = await bcrypt.compare(givenPassword, this.password);
        return isMatch;
    } else {
        throw new Error('Password is not defined');
    }
};
// Create and export the model
export default mongoose.model<TAdmin, AdminModel>('Admin', adminsSchema);
