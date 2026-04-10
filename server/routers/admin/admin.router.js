const express = require("express");
const AdminController = require("../../controllers/admin/admin.controller");
const useAuth = require("../../utils/useAuth");

const adminRouter = express.Router();


adminRouter.get("/profile", useAuth, AdminController.getProfile);
adminRouter.put("/username", useAuth, AdminController.updateUsername);
adminRouter.put("/password", useAuth, AdminController.updatePassword);
adminRouter.put("/email", useAuth, AdminController.updateEmail);
adminRouter.post("/pin", useAuth, AdminController.updatePin);


adminRouter.post("/login", AdminController.login);
adminRouter.post("/logout", AdminController.logout);


module.exports = adminRouter;