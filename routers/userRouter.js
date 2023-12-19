const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/UserController");

//LOGIN & REGISTER
//GET register page
userRouter.get("/register", UserController.Register);
//POST register form submission
userRouter.post("/register", UserController.RegisterUser);
//GET login page
userRouter.get("/login", UserController.Login);
//POST login form submission
userRouter.post("/login", UserController.LoginUser);
//GET logout
userRouter.get("/logout", UserController.Logout);
//GET my-invoice page
userRouter.get("/my-invoice", UserController.displayInvoices);


//GET edit individual profile page (user)
userRouter.get("/userprofile-form", UserController.ProfileEdit);
//POST edit individual profile page (user)
userRouter.post("/userprofile", UserController.ProfileUpdate);

//GET edit user profile page (admin/manager)
userRouter.get("/userprofile-detailsform/:id", UserController.UserEdit);
//POST edit user profile page (admin/manager)
userRouter.post("/userprofile-detailsform/:id", UserController.UserUpdate);




//GET all userprofiles
userRouter.get("/userprofiles", UserController.Users);
//GET profile page (user)
userRouter.get("/userprofile", UserController.Profile);
//GET delete user (admin/manager)
userRouter.get("/:id/delete", UserController.DeleteUserById);
//GET user detail (admin/manager)
userRouter.get("/:id", UserController.UserDetail);



module.exports = userRouter;