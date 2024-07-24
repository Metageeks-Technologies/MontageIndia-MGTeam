import catchAsyncError from '../../middleware/catchAsyncError.js';
import ErrorHandler from '../../utils/errorHandler.js';
import sendToken from '../../utils/sendToken.js';
import Admin from '../../model/user/admin.js';

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

*/


//only for superAdmin
export const signupAdmin = catchAsyncError(async (req, res, next) => {
    // console.log(req.body);
    if (!req.body) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    const { username, name, password } = req.body;


    if (!name || !username || !password) {
        return next(new ErrorHandler("please provide all values", 400));
    }

    const userAlreadyExists = await Admin.findOne({ username });
    if (userAlreadyExists) {
        return next(new ErrorHandler("Username already exists", 400))
    }
     // Set the role as 'superadmin' .becuase only superadmin have signup operation
    req.body.role = 'superadmin';
    req.body.mediaType="all";

    const user = await Admin.create(req.body);

    res.status(201).json({
        success: true,
        message: "SuperAdmin Created successfully",
        user
    })

});

export const loginAdmin = catchAsyncError(async (req, res, next) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await Admin.findOne({ username }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid  Username or Password", 401));
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

export const getCurrentAdmin = catchAsyncError(async (req, res, next) => {

    const { _id } = req.body;
    const user = await Admin.findOne({ _id });
    res.status(200).json({
        success: true,
        user
    });
});

export const createAdmin = catchAsyncError(async (req, res, next) => {
    if (!req.body) {
        return next(new ErrorHandler("body is not defined", 400))
    }
    const { username, name, password } = req.body;
    if (!name || !username || !password) {
        return next(new ErrorHandler("please provide all values", 400));
    }
    const userAlreadyExists = await Admin.findOne({ username });
    if (userAlreadyExists) {
        return next(new ErrorHandler("Username already exists", 400))
    }
    const user = await Admin.create(req.body);

    res.status(201).json({
        success: true,
        message: "Admin Created successfully",
        user
    })
});

export const deleteAdmin = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    const user = await Admin.findOne({ _id: id });

    if (!user) {
        next(new ErrorHandler("user does not exit", 404));
    }
    await user?.deleteOne({ _id: id });
    const users = await Admin.find();
    res.status(200).json({
        success: true,
        message: "Account deleted successfully",
        users
    })

});

export const getAllAdmin = catchAsyncError(async (req, res, next) => {

    const users = await Admin.find();

    res.status(200).json({
        success: true,
        users
    })
});

export const updateAdmin= catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body is not defined", 400))
    }
    const { id,role,category ,mediaType} = req.body;
    console.log(req.body);

    if(!id){return next(new ErrorHandler("please provide id", 400))}

    const adminToUpdate = await Admin.findOne({ _id: id });

    if (!adminToUpdate) {
        return next(new ErrorHandler("Admin not found", 404));
    }
    // Prepare updates object
    const updates: Partial<typeof adminToUpdate> = {};
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

    if(!id){
        return next(new ErrorHandler("body is not defined", 400))
    }

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

export const ChangePassword = catchAsyncError(async (req, res, next) => {

    const { username, newPassword, oldPassword } = req.body;
    if (!username || !newPassword || !oldPassword) {
        return next(new ErrorHandler("Please enter Username and passwords", 400));
    }

    const adminToUpdate = await Admin.findOne({ username }).select("+password");

    if (!adminToUpdate) {
        return next(new ErrorHandler("Admin not found with this username", 401))
    }

    const verifyOldPassword = await adminToUpdate.comparePassword(oldPassword);
    if (!verifyOldPassword) {
        return next(new ErrorHandler("Old password is wrong", 401))
    }
    adminToUpdate.password = newPassword;
    await adminToUpdate.save();

    res.status(200).json({
        success: true,
        Admin
    })
});