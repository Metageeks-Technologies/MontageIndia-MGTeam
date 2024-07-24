import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import Admin from "../model/user/admin.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isAuthenticatedAdmin = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET || "");
    const requestedUser = await Admin.findById((decodedData as JwtPayload).id);
    if (!requestedUser) {
        return next(new ErrorHandler("User not found", 404));
    }

    next();
})