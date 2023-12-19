const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/UserController");

//GET register page
userRouter.get("/register", UserController.Register);

//handling register form submission
userRouter.post("/register", UserController.RegisterUser);

//GET login page
userRouter.get("/login", UserController.Login);

//handling login form submission
userRouter.post("/login", UserController.LoginUser);

//GET logout
userRouter.get("/logout", UserController.Logout);

//GET all userprofiles
userRouter.get("/userprofiles", UserController.Users);

//GET profile page
userRouter.get("/userprofile", UserController.Profile);
userRouter.get("/:id", UserController.UserDetail);


//GET my-invoice page
userRouter.get("/my-invoice", UserController.displayInvoices);

//GET edit profile page
userRouter.get("/userprofile-form", UserController.ProfileEdit);


//POST edit profile page
userRouter.post("/userprofile", UserController.ProfileUpdate);

userRouter.get("/:id/delete", UserController.DeleteUserById);


userRouter.get("/userprofile-detailsform/:id", UserController.UserEdit);

module.exports = userRouter;