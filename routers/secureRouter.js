const express = require("express");
const secureRouter = express.Router();
const SecureController = require("../controllers/SecureController");


//GET for secure area
secureRouter.get("/secure-area", SecureController.Index);

module.exports = secureRouter;