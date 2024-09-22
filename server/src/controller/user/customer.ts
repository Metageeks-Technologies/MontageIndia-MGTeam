import catchAsyncError from "@src/middleware/catchAsyncError.js";
import ErrorHandler from "@src/utils/errorHandler.js";
import sendToken from "@src/utils/sendToken.js";
import Customer from "@src/model/user/customer.js";
import { sendEmail } from "@src/utils/nodemailer/mailer/mailer.js";
import crypto from "crypto";
import config from "@src/utils/config";
import Product from "@src/model/product/product";

/* 
index 

1.signupCustomer
2.loginCustomer
3.logoutCustomer
4.getCurrentCustomer
5.deleteCustomer
6.getAllCustomer
7.updateCustomerDetails
8.ChangePassword
9.forget password
10.reset password
11.getCustomerById
12.add product id to user cart
13. remove the product id from user cart
*/

export const googleLogin = catchAsyncError(async (req, res, next) => {
  const { uid, name, email, image } = req.body;

  if (!uid || !name || !email) {
    return next(new ErrorHandler("Please provide all values", 400));
  }

  const user = await Customer.findOne({ uid });

  if (user) {
    user.emailVerified = true;
    await user.save();
    return res
      .status(200)
      .send({ status: "success", message: "User already exists" });
  }

  const newUser = await Customer.create({
    uid,
    name,
    email,
    image,
    emailVerified: true,
  });

  return res.status(201).send({ status: "success", message: "User created" });
});

export const signupCustomer = catchAsyncError(async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { uid, name, phone, email, password, image } = req.body;

  if (!uid) {
    return next(new ErrorHandler("please provide all values", 400));
  }
  const query = {
    $or: [
      { uid },
      ...(email ? [{ email }] : []),
      ...(phone ? [{ phone }] : []),
    ],
  };
  const userAlreadyExists = await Customer.findOne(query);

  if (userAlreadyExists) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const updatedUser: any = {};

  if (uid) updatedUser.uid = uid;
  if (name) updatedUser.name = name;
  if (phone) updatedUser.phone = phone.slice(1, phone.length);
  if (email) updatedUser.email = email;
  if (password) updatedUser.password = password;
  if (image) updatedUser.image = image;

  const user = await Customer.create(updatedUser);

  res.status(201).json({
    success: true,
    message: "Customer Created successfully",
    user,
  });
});

export const loginCustomer = catchAsyncError(async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const user = await Customer.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Credentials", 401));
  }

  const verifyPassword = await user.comparePassword(password);

  if (!verifyPassword) {
    return next(new ErrorHandler("Invalid  Email or Password", 401));
  }

  sendToken(user, 200, res);
});

export const logoutCustomer = catchAsyncError(async (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

export const getCustomerById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await Customer.findOne({ _id: id });
  res.status(200).json({
    success: true,
    user,
  });
});

export const getCurrentCustomer = catchAsyncError(
  async (req: any, res, next) => {
    // console.log("Id:-",req.user)
    const { id } = req.user;
    const user = await Customer.findOne({ _id: id }).populate(
      "subscription.PlanId"
    );
    console.log(user);

    if(user?.isFirstLogin){
      user.isFirstLogin = false;
      await user.save();
      return res.status(200).json({
        success: true,
        user,
        message:`Hi ${user?.name},Welcome to Montage India!\n
                  We're excited to have you onboard! `, 
      })
    }
    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const deleteCustomer = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await Customer.findOne({ _id: id });

  if (!user) {
    next(new ErrorHandler("user does not exit", 404));
  }

  if (user && user.isDeleted) {
    next(new ErrorHandler("user already deleted", 400));
  }

  await Customer.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});

export const getAllCustomer = catchAsyncError(async (req, res, next) => {
  const { searchTerm, currentPage, dataPerPage } = req.query;

  const queryObject: any = {};
  if (searchTerm) {
    queryObject.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { username: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
    ];
  }

  const limit = parseInt(dataPerPage as string, 10) || 10;
  const skip = (parseInt(currentPage as string, 10) - 1) * limit;

  const customers = await Customer.find(queryObject).skip(skip).limit(limit);

  const totalCustomers = await Customer.countDocuments(queryObject);
  const totalPages = Math.ceil(totalCustomers / limit);

  res.status(200).json({
    success: true,
    customers,
    totalCustomers,
    totalPages,
    currentPage: parseInt(currentPage as string),
    message: "Customers fetched successfully",
  });
});

export const updateCustomerDetails = catchAsyncError(
  async (req: any, res, next) => {
    const { name, currentPassword, newPassword, image, email, phone } =
      req.body;

    console.log(name, currentPassword, newPassword, image);

    const { id } = req.user;
    const customerToUpdate = await Customer.findById(id).select("+password");

    if (!customerToUpdate) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    const updates: Partial<typeof customerToUpdate> = {};
    if (name) updates.name = name;
    if (image) updates.image = image;
    if (email) {
      updates.email = email;
      updates.emailVerified = false;
    }
    if (phone) {
      if (phone[0] === "+") {
        updates.phone = phone.slice(1, phone.length);
      } else {
        updates.phone = phone;
      }
    }
    if (currentPassword && newPassword) {
      const verifyPassword = await customerToUpdate.comparePassword(
        currentPassword as string
      );
      console.log("verify", verifyPassword);
      if (!verifyPassword) {
        return next(new ErrorHandler("Current password is incorrect", 400));
      }
      updates.password = newPassword as string;
    }
    console.log(updates);

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCustomer) {
      return next(new ErrorHandler("Customer not found after update", 404));
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  }
);

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { id, newPassword, oldPassword } = req.body;

  if (!newPassword || !oldPassword) {
    return next(new ErrorHandler("Please enter new and old passwords", 400));
  }

  const customerToUpdate = await Customer.findOne({ _id: id }).select(
    "+password"
  );

  if (!customerToUpdate) {
    return next(new ErrorHandler("Customer not found", 401));
  }

  if (oldPassword === newPassword) {
    return next(
      new ErrorHandler(
        "New password cannot be the same as the old password.",
        400
      )
    );
  }

  const verifyOldPassword = await customerToUpdate.comparePassword(oldPassword);
  if (!verifyOldPassword) {
    return next(new ErrorHandler("Old password is wrong", 401));
  }
  customerToUpdate.password = newPassword;
  await customerToUpdate.save();

  res.status(200).json({
    success: true,
    customer: customerToUpdate,
    message: "Password changed successfully",
  });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Please enter email", 400));
  }

  const customer = await Customer.findOne({ email });

  if (!customer) {
    return next(new ErrorHandler("Customer not found with this email", 404));
  }

  const token = crypto.randomBytes(20).toString("hex");
  customer.resetPasswordToken = token;
  customer.resetPasswordExpires = Date.now() + 600000; // token will expire in 10 minutes

  await customer.save();

  const mailOptions = {
    from: config.emailUser as string,
    to: email as string,
    subject: "Password Reset" as string,
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${process.env.CLIENT_URL}/auth/user/reset-password/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n` as string,
  };

  sendEmail(mailOptions)
    .then(() => {
      console.log("Email sent successfully");
    })
    .catch((error) => {
      console.error("Failed to send email:", error);
    });

  res.status(200).json({
    success: true,
    message: "Email sent successfully",
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { password, token } = req.body;

  const customerToUpdate = await Customer.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!customerToUpdate) {
    return res
      .status(400)
      .json({ message: "Password reset token is invalid or has expired" });
  }

  customerToUpdate.password = password;
  customerToUpdate.resetPasswordToken = undefined;
  customerToUpdate.resetPasswordExpires = undefined;

  await customerToUpdate.save();

  res.status(200).json({
    message:
      "Password has been reset suscessfully.now you can close this tab or window",
  });
});

export const addProductToCart = catchAsyncError(async (req: any, res, next) => {
  const { productId, varientId } = req.body;
  const { id } = req.user;

  if (!id) {
    console.log("user dpes not exists");
    next(new ErrorHandler("user does not exit", 404));
  }
  const customer = await Customer.findById(id);
  if (!customer) {
    return next(new ErrorHandler("Customer not found", 404));
  }
  const productExists = customer.cart.some(
    (item: any) => item.toString() === productId
  );
  if (productExists) {
    return next(new ErrorHandler("Product already exists in the cart", 400));
  }

  customer.cart.push(productId);
  await customer?.save();

  const product = await Product.findById(productId);
  res
    .status(200)
    .json({ message: "Product added to cart successfully", cart: [product] });
});

export const removeProductFromCart = catchAsyncError(
  async (req: any, res, next) => {
    const { productId } = req.body;
    const { id } = req.user;
    // console.log("first", productId, variantId);
    if (!id) {
      console.log("User does not exist");
      return next(new ErrorHandler("User does not exist", 404));
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    // Find the index of the product in the cart
    const productIndex = customer.cart.findIndex(
      (item: any) => item.toString() === productId
    );
    if (productIndex === -1) {
      return next(new ErrorHandler("Product not found in the cart", 404));
    }

    // Remove the product and variant from the cart
    customer.cart.splice(productIndex, 1);
    await customer.save();
    console.log("Updated customer cart:", customer.cart);

    // Optionally, fetch the removed product details
    const removedProduct = await Product.findById(productId);

    res.status(200).json({
      message: "Product removed from cart successfully",
      removedProduct,
    });
  }
);

export const isPhoneExist = catchAsyncError(async (req, res, next) => {
  const phone = req.query.phone as string;
  console.log("phone", phone);
  if (!phone) {
    return next(new ErrorHandler("Please provide phone", 400));
  }
  const updatedPhone = phone?.slice(1, phone.length);
  console.log("updatedPhone", updatedPhone);
  const user = await Customer.findOne({ phone: updatedPhone });
  if (!user) {
    return res
      .status(200)
      .json({ success: false, message: "Phone number not found" });
  }
  res.status(200).json({ success: true, message: "Phone number found" });
});

export const isPhoneEmailExist = catchAsyncError(async (req, res, next) => {
  const { phone, email } = req.query;
  if (!phone && !email) {
    return next(new ErrorHandler("Please provide phone or email", 400));
  }

  const user = await Customer.findOne({ $or: [{ phone }, { email }] });

  if (user) {
    return res
      .status(200)
      .json({
        success: true,
        message: "User already exits with this email or PhoneNumber ",
      });
  }

  res.status(200).json({ success: false, message: "User not found" });
});

export const verifyEmail = catchAsyncError(async (req: any, res, next) => {
  const { email } = req.body;
  console.log("email", email);
  const user = await Customer.findOne({ email });
  console.log("user", user);
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }
  user.emailVerified = true;
  await user.save();
  console.log("user", user);
  res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
});

export const onDemandForm = catchAsyncError(async (req: any, res, next) => {
  const { email, name, phone, message, mediaType } = req.body;
  console.log("req.body", req.body);

  if (!email || !name || !phone || !message || !mediaType) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  console.log("sender", config.emailUser);
  console.log("reciever", config.montageEmail);

  const mailOptions = {
    from: config.emailUser as string,
    to: config.montageEmail as string,
    subject: "User Product Request" as string,
    text: `Dear MontageIndia Team,\n
      We have received the following details from a MontageIndia user:\n
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      MediaType:${mediaType}
      Message: ${message}\n
      Please review and respond as needed,
      Regards,
      MontageIndia Team` as string,
  };

  await sendEmail(mailOptions)
    .then(() => {
      console.log("Email sent successfully");
      return res
        .status(200)
        .json({ success: true, message: "Email sent successfully" });
    })
    .catch((error) => {
      console.error("Failed to send email:", error);
      return res
        .status(400)
        .json({ success: false, message: "Error sending email" });
    });
});
