import catchAsyncError from '@src/middleware/catchAsyncError.js';
import ErrorHandler from '@src/utils/errorHandler.js';
import sendToken from '@src/utils/sendToken.js';
import Customer from '@src/model/user/customer.js';
import { sendEmail } from '@src/utils/nodemailer/mailer/mailer.js';
import crypto from "crypto";
import config from '@src/utils/config';
import Product from '@src/model/product/product';


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


export const signupCustomer = catchAsyncError(async (req, res, next) => {
    
    if (!req.body) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    const { name,username, email, password } = req.body;

    if (!name || !email || !username || !password) {
        return next(new ErrorHandler("please provide all values", 400));
    }

    const userAlreadyExists = await Customer.findOne({$or: [{ username }, { email }]});

    if (userAlreadyExists) {
        return next(new ErrorHandler("Username already exists", 400))
    }

    const user = await Customer.create(req.body);

    res.status(201).json({
        success: true,
        message: "Customer Created successfully",
        user
    });
});

export const loginCustomer = catchAsyncError(async (req, res, next) => {

    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const user = await Customer.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
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

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).status(200).json({
        success: true,
        message: "Logged Out Successfully"
    });
});

export const getCustomerById= catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const user = await Customer.findOne({ _id: id });
    res.status(200).json({
        success: true,
        user
    });
});

export const getCurrentCustomer = catchAsyncError(async (req:any, res, next) => {

    const { id } = req.user;
    console.log("sdsd",id)
    const user = await Customer.findOne({ _id: id });
    console.log(user)
    res.status(200).json({
        success: true,
        user
    }); 
});

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

    const {searchTerm,currentPage,dataPerPage} = req.query;

    const queryObject:any = {};
    if (searchTerm) {
        queryObject.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { username: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
        ]
    }

    const limit = parseInt(dataPerPage as string, 10) || 10;
    const skip = (parseInt(currentPage as string, 10) - 1) * limit;

    const customers = await Customer.find(queryObject)
        .skip(skip)
        .limit(limit);

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

export const updateCustomerDetails = catchAsyncError(async (req:any, res, next) => {
    const { name, email} = req.body;
    const {id}= req.user;
    const customerToUpdate = await Customer.findById(id);

    if (!customerToUpdate) {
        return next(new ErrorHandler("Customer not found", 404));
    }
    const updates: Partial<typeof customerToUpdate> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedCustomer) {
        return next(new ErrorHandler("Customer not found after update", 404));
    }

    res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        customer: updatedCustomer
    });
});

export const changePassword = catchAsyncError(async (req, res, next) => {

    const { id, newPassword, oldPassword } = req.body;

    if (!newPassword || !oldPassword) {
        return next(new ErrorHandler("Please enter new and old passwords", 400));
    }

    const customerToUpdate = await Customer.findOne({ _id: id }).select("+password");

    if (!customerToUpdate) {
        return next(new ErrorHandler("Customer not found", 401))
    }

     if (oldPassword === newPassword) {
      return next(new ErrorHandler('New password cannot be the same as the old password.',400));
    }

    const verifyOldPassword = await customerToUpdate.comparePassword(oldPassword);
    if (!verifyOldPassword) {
        return next(new ErrorHandler("Old password is wrong", 401))
    }
    customerToUpdate.password = newPassword;
    await customerToUpdate.save();

    res.status(200).json({
        success: true,
        customer: customerToUpdate,
        message: "Password changed successfully"
    });
    
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Please enter email", 400));
    }

    const customer = await Customer.findOne({ email });

    if(!customer){
        return next(new ErrorHandler("Customer not found with this email", 404));
    }

    const token = crypto.randomBytes(20).toString('hex');
    customer.resetPasswordToken = token;
    customer.resetPasswordExpires = Date.now() + 600000; // token will expire in 10 minutes

    await customer.save();

    const mailOptions = {
        from: config.emailUser as string,
        to: email as string,
        subject: 'Password Reset' as string,
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${process.env.CLIENT_URL}/auth/user/reset-password/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n` as string
    };

    sendEmail(mailOptions)
    .then(() => {
        console.log('Email sent successfully');
    })
    .catch((error) => {
        console.error('Failed to send email:', error);
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
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!customerToUpdate) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    customerToUpdate.password = password; 
    customerToUpdate.resetPasswordToken = undefined;
    customerToUpdate.resetPasswordExpires = undefined;

    await customerToUpdate.save();

    res.status(200).json({ message: 'Password has been reset suscessfully.now you can close this tab or window'});

} );

export const addProductToCart = catchAsyncError( async ( req:any, res, next ) => {
    const { productId } = req.body;
    const { id } = req.user;

    console.log("productId",productId)
    if ( !id )   {
        console.log('user dpes not exists')
        next(new ErrorHandler("user does not exit", 404));
    }
    const customer = await Customer.findById( id );
    if (!customer) {
        return next(new ErrorHandler("Customer not found", 404));
    }
    console.log("customer",customer)
    const productExists = customer.cart.some((item: any) => item.toString() === productId);
    console.log("sas",productExists)
    if (productExists) {
        return next(new ErrorHandler("Product already exists in the cart", 304));
    }
    
    customer.cart.push( productId )
    console.log("added new product:",customer)
    await customer?.save();
    
    const product=await Product.findById(productId)
    res.status(200).json({ message: 'Product added to cart successfully', cart: [product] });
} )

export const removeProductFromCart = catchAsyncError(async (req: any, res, next) => {
    const { productId, removeAll } = req.body;  
    const { id } = req.user;
  
    if (!id) {
      console.log('User does not exist');
      return next(new ErrorHandler("User does not exist", 404));
    }
  
    const customer = await Customer.findById(id);
    if (customer) {
      if (removeAll) {
        // Remove all instances of the productId
        customer.cart = customer.cart.filter((cartItemId) => cartItemId.toString() !== productId.toString());
      } else {
        // Remove only the first occurrence of the productId
        const index = customer.cart.findIndex((cartItemId) => cartItemId.toString() === productId.toString());
        if (index > -1) {
          customer.cart.splice(index, 1);
        } else {
          return res.status(404).json({ message: 'Product not found in cart' });
        }
      }
  
      await customer.save();
      console.log("Updated cart:", customer.cart);
      res.status(200).json({ message: `Product ${removeAll ? 'removed entirely' : 'removed'} from cart successfully` });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  });
  

