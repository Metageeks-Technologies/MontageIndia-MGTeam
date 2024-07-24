import express from 'express';
import {
    loginAdmin,
    signupAdmin,
    deleteAdmin,
    updateAdminRole,
    logoutAdmin,
    getAllAdmin,
    getCurrentAdmin,
    updateAdminCategory,
    createAdmin,
    updateAdmin
} from '../../controller/user/admin.js';

const adminRouter = express.Router();

adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").get(logoutAdmin)
// adminRouter.route("/changePassword").patch(ChangePassword);
adminRouter.route("/getAllAdmin").get(getAllAdmin);
adminRouter.route("/signup").post(signupAdmin);
adminRouter.route("/updateRole").patch(updateAdminRole);
adminRouter.route("/updateCategory").patch(updateAdminCategory);
adminRouter.route("/:id").delete(deleteAdmin);
adminRouter.route("/getCurrAdmin").get(getCurrentAdmin);
adminRouter.route("/createAdmin").post(createAdmin);
adminRouter.route("/updateAdmin").patch(updateAdmin);
export default adminRouter;