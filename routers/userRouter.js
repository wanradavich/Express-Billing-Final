const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/UserController");

//GET register page
userRouter.get("/register", UserController.Register);

//handling register form submission
userRouter.post("/register", UserController.RegisterUser);

module.exports = userRouter;