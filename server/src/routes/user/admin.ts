import express from 'express';
import {
    loginAdmin,
    signupAdmin,
    logoutAdmin,
    getAllAdmin,
    getCurrentAdmin,
    createAdmin,
    updateAdmin,
    changePassword,
    forgetPassword,
    updateAdminDetails,
    resetPassword,
    getAdminById,
    toggleDeleteAdmin,
    getSiteData
} from '../../controller/user/admin.js';
import { isAuthenticatedAdmin } from '@src/middleware/auth.js';
import { clearActivity, getActivity } from '@src/controller/user/activity.js';

const adminRouter = express.Router();

adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").get(logoutAdmin)
adminRouter.route("/getAllAdmin").get(isAuthenticatedAdmin,getAllAdmin);
adminRouter.route("/signup").post(signupAdmin);
adminRouter.route("/getCurrAdmin").get(isAuthenticatedAdmin,getCurrentAdmin);
adminRouter.route("/createAdmin").post(isAuthenticatedAdmin,createAdmin);
adminRouter.route("/updateAdmin/:id").patch(isAuthenticatedAdmin,updateAdmin);
adminRouter.route("/updateAdminDetails").patch(isAuthenticatedAdmin,updateAdminDetails);
adminRouter.route("/changePassword").patch(isAuthenticatedAdmin,changePassword);
adminRouter.route("/forgetPassword").post(forgetPassword);
adminRouter.route("/resetPassword").post(resetPassword);
adminRouter.route("/siteData").get(isAuthenticatedAdmin,getSiteData);
adminRouter.route("/:id").get(isAuthenticatedAdmin,getAdminById);
adminRouter.route("/:id").delete(isAuthenticatedAdmin,toggleDeleteAdmin);

// activity route
adminRouter.route("/Activity/getAllActivity").get(isAuthenticatedAdmin,getActivity);
adminRouter.route("/Activity/clearActivity").delete(isAuthenticatedAdmin,clearActivity);

export default adminRouter;