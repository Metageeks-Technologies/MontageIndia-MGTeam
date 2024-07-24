import catchAsyncError from '../../middleware/catchAsyncError.js';
import ErrorHandler from '../../utils/errorHandler.js';
import sendToken from '../../utils/sendToken.js';
import Admin from '../../model/user/admin.js';

/* 
index 
1.signupAdmin
2.loginAdmin
3.logoutAdmin
4.getAllAdmin
5.updateAdminRole
6.updateAdminCategory
7.deleteAdmin
8.getCurrentAdmin
9.updateAdminCategory
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

})

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
})

export const logoutAdmin = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).status(200).json({
        success: true,
        message: "Logged Out Successfully"
    });


})

export const getCurrentAdmin = catchAsyncError(async (req, res, next) => {

    const { _id } = req.body
    const user = await Admin.findOne({ _id });
    res.status(200).json({
        success: true,
        user
    });
})

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
})

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

})

export const updateAdminRole = catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body is not defined", 400))
    }
    const { id, role } = req.body;
    console.log(req.body);

    const user = await Admin.findOne({ _id: id })
    if (user) {
        user.role = role;
        await user.save();

    }

    const users = await Admin.find();
    res.status(200).json({
        success: true,
        message: "user role updated successfully",
        users
    })

})

export const updateAdminCategory = catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body is not defined", 400))
    }
    const { id, category } = req.body;
    console.log(req.body);

    const user = await Admin.findOne({ _id: id })
    if (user) {
        user.category = category;
        await user.save();

    }

    const users = await Admin.find();
    res.status(200).json({
        success: true,
        message: "user category updated successfully",
        users
    })

})

export const getAllAdmin = catchAsyncError(async (req, res, next) => {

    const users = await Admin.find();

    res.status(200).json({
        success: true,
        users
    })
})

export const updateAdmin = catchAsyncError(async (req, res, next) => {
    const { id } = req.query;
    console.log(req.query);
    const { name, email,mediaType, category, role, senderId } = req.body;

    const adminToUpdate = await Admin.findById(id);
    if (!adminToUpdate) {
        return next(new ErrorHandler("Admin not found", 404));
    }

    const sender = await Admin.findById(senderId);
    if (!sender) {
        return next(new ErrorHandler("Sender not found", 404));
    }

    if (adminToUpdate.role === "superAdmin" && sender.role !== "superAdmin") {
        return next(new ErrorHandler("Only superadmin can update superadmin", 401));
    }

    // Prepare updates object
    const updates: Partial<typeof adminToUpdate> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (category && sender.role !== "superAdmin" ) updates.category = category;
    if (mediaType && sender.role !== "superAdmin") updates.mediaType = mediaType;
    if (role && sender.role !== "superAdmin") updates.role = role;

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



// change password
// const ChangePassword = catchAsyncError(async (req, res, next) => {

//     const { email, newPassword, oldPassword } = req.body;
//     if (!email || !newPassword || !oldPassword) {
//         return next(new ErrorHandler("Please enter Email and passwords", 400));
//     }
//     const Admin = await Admin.findOne({ email }).select("+password");
//     if (!Admin) {
//         return next(new ErrorHandler("Admin not found with this email", 401))
//     }
//     const verifyOldPassword = await Admin.comparePassword(oldPassword);
//     if (!verifyOldPassword) {
//         return next(new ErrorHandler("Old password is wrong", 401))
//     }
//     Admin.password = newPassword;
//     await Admin.save();



//     res.status(200).json({
//         success: true,
//         Admin
//     })
// })
