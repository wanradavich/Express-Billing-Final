const ProfileController = require("../controllers/ProfileController");
const express = require("express");
const profilesRouter = express.Router();

//router for create
profilesRouter.get("/create", ProfileController.Create);
profilesRouter.post("/create", ProfileController.CreateProfile);

//router for get by id
profilesRouter.get("/edit/:id", ProfileController.Edit);
profilesRouter.post("/edit/:id", ProfileController.EditProfile);
profilesRouter.get("/:id/delete", ProfileController.DeleteProfileById);

// catch-all route
profilesRouter.get("/:id", ProfileController.Detail);
profilesRouter.get("/", ProfileController.Index);

module.exports = profilesRouter;
