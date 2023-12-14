const express = require("express");
const indexRouter = express.Router();

//home page route
indexRouter.get("/", async (req, res) => {
    res.render("home", {title: "Home"});
});


module.exports = indexRouter;