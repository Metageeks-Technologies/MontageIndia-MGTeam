import express from 'express';
import {
    loginAdmin,
    signupAdmin,
    deleteAdmin,
    logoutAdmin,
    getAllAdmin,
    getCurrentAdmin,
    createAdmin,
    updateAdmin,
    changePassword,
    forgetPassword,
    updateAdminDetails,
    resetPassword,
    getAdminById
} from '../../controller/user/admin.js';

const adminRouter = express.Router();

adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").get(logoutAdmin)
adminRouter.route("/getAllAdmin").get(getAllAdmin);
adminRouter.route("/signup").post(signupAdmin);
adminRouter.route("/:id").delete(deleteAdmin);
adminRouter.route("/getCurrAdmin").get(getCurrentAdmin);
adminRouter.route("/createAdmin").post(createAdmin);
adminRouter.route("/updateAdmin").patch(updateAdmin);
adminRouter.route("/updateAdminDetails").patch(updateAdminDetails);
adminRouter.route("/changePassword").patch(changePassword);
adminRouter.route("/forgetPassword").post(forgetPassword);
adminRouter.route("/resetPassword").post(resetPassword);
adminRouter.route("/:id").get(getAdminById);

export default adminRouter;