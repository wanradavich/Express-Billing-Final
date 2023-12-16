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

//GET profile page
userRouter.get("/userprofile", UserController.Profile);

//GET my-invoice page
// userRouter.get("/my-invoice", UserController.UserInvoices);

//GET edit profile page
userRouter.get("/userprofile-form", UserController.ProfileEdit);

//POST edit profile page
userRouter.post("/userprofile", UserController.ProfileUpdate);

module.exports = userRouter;