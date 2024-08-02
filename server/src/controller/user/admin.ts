import catchAsyncError from '../../middleware/catchAsyncError.js';
import ErrorHandler from '../../utils/errorHandler.js';
import sendToken from '../../utils/sendToken.js';
import Admin from '../../model/user/admin.js';
import { sendEmail } from '@src/utils/nodemailer/mailer/mailer.js';
import crypto from "crypto";


/* 
index 

1.signupAdmin
2.loginAdmin
3.logoutAdmin
4.getCurrentAdmin
5.creatAdmin
8.updateAdmin
6.deleteAdmin
7.getAllAdmin
9.updateAdminDetails
10.ChangePassword
11.forget password
12.reset password
13.getAdminById

*/

//only for superAdmin
export const signupAdmin = catchAsyncError(async (req, res, next) => {
    
    if (!req.body) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    const { name,username, email, password } = req.body;

    if (!name || !email || !username || !password) {
        return next(new ErrorHandler("please provide all values", 400));
    }

    const userAlreadyExists = await Admin.findOne({$or: [{ username }, { email }]});

    if (userAlreadyExists) {
        return next(new ErrorHandler("Username already exists", 400))
    }
    // Set the role as 'superadmin' .becuase only superadmin have signup operation
    req.body.role = 'superadmin';

    const user = await Admin.create(req.body);

    res.status(201).json({
        success: true,
        message: "SuperAdmin Created successfully",
        user
    });
});

export const loginAdmin = catchAsyncError(async (req, res, next) => {

    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const user = await Admin.findOne({
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

export const logoutAdmin = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).status(200).json({
        success: true,
        message: "Logged Out Successfully"
    });
});

export const getAdminById= catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const user = await Admin.findOne({ _id: id });
    res.status(200).json({
        success: true,
        user
    });
});

export const getCurrentAdmin = catchAsyncError(async (req:any, res, next) => {

    const { id } = req.user;
    const user = await Admin.findOne({ "_id": id });
    res.status(200).json({
        success: true,
        user
    }); 
});

export const createAdmin = catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body is not defined", 400))
    }
    console.log("body",req.body);
    const { username, email, name, password, role, mediaType,category } = req.body;
    if (!name || !email || !username || !password) {
        return next(new ErrorHandler("name, username, email and password are required", 400));
    }
    
    const userAlreadyExists = await Admin.findOne({
        $or: [{ username }, { email }]
    });

    if (userAlreadyExists) {
        return next(new ErrorHandler("User already exists", 400));
    }
    const user = await Admin.create(req.body);

    res.status(201).json({
        success: true,
        message: "Admin Created successfully",
        user
    });
});

export const deleteAdmin = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    const user = await Admin.findOne({ _id: id });

    if (!user) {
        next(new ErrorHandler("user does not exit", 404));
    }

    if (user && user.isDeleted) {
        next(new ErrorHandler("user already deleted", 400));
    }

    await Admin.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    res.status(200).json({
        success: true,
        message: "Account deleted successfully",
    });
   
});

export const getAllAdmin = catchAsyncError(async (req, res, next) => {

    const {searchTerm,currentPage,roleSearch,dataPerPage} = req.query;

    const queryObject:any = {};
    if (searchTerm) {
        queryObject.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { username: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { role: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } },
            { mediaType: { $regex: searchTerm, $options: 'i' } },
        ]
    }

    if (roleSearch && typeof roleSearch === 'string' && roleSearch!=='all') {
         queryObject.role = new RegExp(`^${roleSearch}$`, 'i'); 
    }

    const limit = parseInt(dataPerPage as string, 10) || 10;
    const skip = (parseInt(currentPage as string, 10) - 1) * limit;

    const admins = await Admin.find(queryObject)
        .skip(skip)
        .limit(limit);

    const totalAdmins = await Admin.countDocuments(queryObject);
    const totalPages = Math.ceil(totalAdmins / limit);

    res.status(200).json({
        success: true,
        admins,
        totalAdmins,
        totalPages,
        currentPage: parseInt(currentPage as string),
        message: "Admins fetched successfully",
    });
});

export const updateAdmin= catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body is not defined", 400))
    }
    const { id } = req.params;
    const {name, email,role,category ,mediaType} = req.body;
    console.log(req.body);

    const adminToUpdate = await Admin.findOne({ _id: id });

    if (!adminToUpdate) {
        return next(new ErrorHandler("Admin not found", 404));
    }
    // Prepare updates object
    const updates: Partial<typeof adminToUpdate> = {};
    if (name) updates.name = name;
    // if (username) updates.username = username;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (category) updates.category = category;
    if (mediaType) updates.mediaType = mediaType;

    // Update the admin    
    const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedAdmin) {
        return next(new ErrorHandler("Admin not found after update", 404));
    }

    res.status(200).json({
        success: true,
        message: "Admin updated successfully",
        admin: updatedAdmin
    });
    
});

export const updateAdminDetails = catchAsyncError(async (req, res, next) => {
    const { id,name, email} = req.body;
    const adminToUpdate = await Admin.findById(id);

    if (!adminToUpdate) {
        return next(new ErrorHandler("Admin not found", 404));
    }
    const updates: Partial<typeof adminToUpdate> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedAdmin) {
        return next(new ErrorHandler("Admin not found after update", 404));
    }

    res.status(200).json({
        success: true,
        message: "Admin updated successfully",
        admin: updatedAdmin
    });
});

export const changePassword = catchAsyncError(async (req, res, next) => {

    const { id, newPassword, oldPassword } = req.body;

    if (!newPassword || !oldPassword) {
        return next(new ErrorHandler("Please enter new and old passwords", 400));
    }

    const adminToUpdate = await Admin.findOne({ _id: id }).select("+password");

    if (!adminToUpdate) {
        return next(new ErrorHandler("Admin not found", 401))
    }

     if (oldPassword === newPassword) {
      return next(new ErrorHandler('New password cannot be the same as the old password.',400));
    }

    const verifyOldPassword = await adminToUpdate.comparePassword(oldPassword);
    if (!verifyOldPassword) {
        return next(new ErrorHandler("Old password is wrong", 401))
    }
    adminToUpdate.password = newPassword;
    await adminToUpdate.save();

    res.status(200).json({
        success: true,
        Admin,
        message: "Password changed successfully"
    });
    
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Please enter email", 400));
    }

    const admin = await Admin.findOne({ email });

    if(!admin){
        return next(new ErrorHandler("Admin not found with this email", 404));
    }

    const token = crypto.randomBytes(20).toString('hex');
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = Date.now() + 600000; // token will expire in 10 minutes

    await admin.save();

    const mailOptions = {
        from: process.env.EMAIL_USER as string,
        to: email as string,
        subject: 'Password Reset' as string,
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${process.env.CLIENT_URL}/admin/reset-password/${token}\n\n
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

    const adminToUpdate = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!adminToUpdate) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    adminToUpdate.password = password; 
    adminToUpdate.resetPasswordToken = undefined;
    adminToUpdate.resetPasswordExpires = undefined;

    await adminToUpdate.save();

    res.status(200).json({ message: 'Password has been reset suscessfully.now you can close this tab or window'});

});
