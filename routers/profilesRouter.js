const ProfileController = require("../controllers/ProfileController");

const fs = require("fs").promises;
const path = require("path");

const express = require("express");
const profilesRouter = express.Router();

// construct the path to our data folder
const dataPath = path.join(__dirname, "../data/");

profilesRouter.get("/", ProfileController.Index);

//router for create
profilesRouter.get("/create", ProfileController.Create);
profilesRouter.post("/create", ProfileController.CreateProfile);
//router for get by id
profilesRouter.get("/:id", ProfileController.Detail);
profilesRouter.get("/edit/:id", ProfileController.Edit);
profilesRouter.post("/edit/:id", ProfileController.EditProfile);
//router for delete
profilesRouter.get("/:id/delete", ProfileController.DeleteProfileById);



module.exports = profilesRouter;
