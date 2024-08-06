import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import Admin from "../model/user/admin.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import customer from "@src/model/user/customer.js";

export const isAuthenticatedAdmin = catchAsyncError(async (req: any, res, next) => {
    // console.log("auth",req);
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET || "");
    const requestedUser = await Admin.findById((decodedData as JwtPayload).id);
    if (!requestedUser) {
        return next(new ErrorHandler("User not found", 404));
    }
    if(requestedUser.isDeleted){
       return res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        }).status(400).json({
            success: false,
            message: "User not found"
        });
    }
    req.user = requestedUser;
    // console.log("user",req.user);
    next();
});

export const isAuthenticatedCustomer = catchAsyncError(async (req: any, res, next) => {
    // console.log("auth",req);
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_CUSTOMER || "");
    const requestedUser = await customer.findById((decodedData as JwtPayload).id);
    if (!requestedUser) {
        return next(new ErrorHandler("User not found", 404));
    }
    if(requestedUser.isDeleted){
       return res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        }).status(400).json({
            success: false,
            message: "User not found"
        });
    }
    req.user = requestedUser;
    // console.log("user",req.user);
    next();
});


export const checkProductAccess = catchAsyncError(async (req: any, res: any, next: any) => {

    
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
        return next(new ErrorHandler("Only Admins can access this resource", 403));
    }

    if (Array.isArray(req.user.mediaType)) {
        // Grant access if 'all' is present in mediaType array
        if (req.user.mediaType.includes('all') || req.user.mediaType.includes(req.body.mediaType)) {
            return next();
        }
        return next(new ErrorHandler("You don't have permission to access this media resource.", 403));
    } else if (req.user.mediaType !== 'all' && req.user.mediaType !== req.body.mediaType) {
        return next(new ErrorHandler("You don't have permission to access this media resource.", 403));
    }

    if (Array.isArray(req.user.category)) {
        // Grant access if 'all' is present in category array
        if (req.user.category.includes('all') || req.user.category.includes(req.body.category)) {
            return next();
        }
        return next(new ErrorHandler("You don't have permission to access this category resource.", 403));
    } else if (req.user.category !== 'all' && req.user.category !== req.body.category) {
        return next(new ErrorHandler("You don't have permission to access this category resource.", 403));
    }

    next();

});