const express = require("express");
const secureRouter = express.Router();
const SecureController = require("../controllers/SecureController");


//GET for secure area
secureRouter.get("/", SecureController.Index);
// //GET for admin
// secureRouter.get("/admin", SecureController.Admin);
// //GET for manager
// secureRouter.get("/manager", SecureController.Manager);

module.exports = secureRouter;