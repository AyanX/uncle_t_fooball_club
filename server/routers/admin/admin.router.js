const express = require("express");
const AdminController = require("../../controllers/admin/admin.controller");

const adminRouter = express.Router();


adminRouter.get("/profile", AdminController.getProfile);
adminRouter.put("/username", AdminController.updateUsername);
adminRouter.put("/password", AdminController.updatePassword);
adminRouter.put("/email", AdminController.updateEmail);
adminRouter.post("/pin", AdminController.updatePin);


module.exports = adminRouter;