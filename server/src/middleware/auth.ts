import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import Admin from "@src/model/user/admin.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "@src/utils/config.js";
import Customer from "@src/model/user/customer.js";
import { auth } from "@src/utils/firebase/firebaseAdmin.js";
import customer from "@src/model/user/customer.js";

export const isAuthenticatedAdmin = catchAsyncError(
  async (req: any, res, next) => {
    // console.log("auth",req);
    const { _mi_token } = req.cookies;
    // console.log("token",token);
    if (!_mi_token) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401)
      );
    }

    const decodedData = jwt.verify(_mi_token, config.jwtSecret || "");
    const requestedUser = await Admin.findById((decodedData as JwtPayload).id);
    if (!requestedUser) {
      return next(new ErrorHandler("User not found", 404));
    }
    if (requestedUser.isDeleted) {
      return res
        .cookie("_mi_token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
        })
        .status(400)
        .json({
          success: false,
          message: "User not found",
        });
    }
    req.user = requestedUser;
    // console.log("user",req.user);
    next();
  }
);

export const isAuthenticatedCustomer = catchAsyncError(
  async (req: any, res, next) => {
    // console.log("auth",req);
    const { token } = req.cookies;
    if (!token) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401)
      );
    }

    const decodedData = jwt.verify(token, config.customerJwtSecret || "");
    const requestedUser = await Customer.findById(
      (decodedData as JwtPayload).id
    );
    if (!requestedUser) {
      return next(new ErrorHandler("User not found", 404));
    }
    if (requestedUser.isDeleted) {
      return res
        .cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
        })
        .status(400)
        .json({
          success: false,
          message: "User not found",
        });
    }
    req.user = requestedUser;
    // console.log("user",req.user);
    next();
  }
);

export const isAuthorizedCustomer = catchAsyncError(
  async (req: any, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const idToken = authHeader.split("Bearer ")[1];
    if (!idToken) {
      return next();
    }
    // console.log("idToken",idToken);

    auth
      .auth()
      .verifyIdToken(idToken)
      .then(async (decodedToken) => {
        // console.log("decodedToken",decodedToken);
        const uid = decodedToken.uid;

        // console.log("req.user",uid);
        const user = await customer.findOne({ uid });
        // console.log("user",user);
        if (!user) {
          return res.status(401).json({ error: "Invalid or expired token" });
        }
        req.user = user;
        // console.log("req.user",req.user);
        next();
      })
      .catch((error) => {
        return res.status(401).json({ error: "Invalid or expired token" });
      });
  }
);

export const checkProductAccess = catchAsyncError(
  async (req: any, res: any, next: any) => {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return next(
        new ErrorHandler("Only Admins can access this resource", 403)
      );
    }

    if (Array.isArray(req.user.mediaType)) {
      // Grant access if 'all' is present in mediaType array
      if (
        req.user.mediaType.includes("all") ||
        req.user.mediaType.includes(req.body.mediaType)
      ) {
        return next();
      }
      return next(
        new ErrorHandler(
          "You don't have permission to access this media resource.",
          403
        )
      );
    } else if (
      req.user.mediaType !== "all" &&
      req.user.mediaType !== req.body.mediaType
    ) {
      return next(
        new ErrorHandler(
          "You don't have permission to access this media resource.",
          403
        )
      );
    }

    if (Array.isArray(req.user.category)) {
      // Grant access if 'all' is present in category array
      if (
        req.user.category.includes("all") ||
        req.user.category.includes(req.body.category)
      ) {
        return next();
      }
      return next(
        new ErrorHandler(
          "You don't have permission to access this category resource.",
          403
        )
      );
    } else if (
      req.user.category !== "all" &&
      req.user.category !== req.body.category
    ) {
      return next(
        new ErrorHandler(
          "You don't have permission to access this category resource.",
          403
        )
      );
    }

    next();
  }
);

const processedEventIds = new Set();

export const checkDuplicateEvent = catchAsyncError(
  async (req: any, res: any, next: any) => {
    console.log("checkDuplicateEvent", processedEventIds);

    const eventId = req.headers["x-razorpay-event-id"];
    console.log("eventId", eventId);
    if (processedEventIds.has(eventId)) {
      console.log(`Duplicate event with ID ${eventId}. Skipping processing.`);
      res.status(200).send();
    } else {
      processedEventIds.add(eventId);
      setTimeout(() => processedEventIds.delete(eventId), 3600000);
      next();
    }
  }
);

export const firebaseAuth = catchAsyncError(async (req: any, res, next) => {
  const authHeader = req.headers.authorization;
  // clg
  // console.log("authHeader:-",authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  // console.log("idToken",idToken);

  auth
    .auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
      // console.log("decodedToken",decodedToken);
      const uid = decodedToken.uid;

      // console.log("req.user",uid);

      const user = await customer.findOne({ uid });
      // console.log("user",user);
      if (!user) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      req.user = user;
      // console.log("req.user",req.user);
      next();
    })
    .catch((error) => {
      return res.status(401).json({ error: "Invalid or expired token" });
    });
});
