"use strict";

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3008;
//requiring passport and passport local
const passport = require("passport");
const localStrategy = require("passport-local");

require("dotenv").config();

//set up for the searchbar
const profileController = require("./controllers/ProfileController");
const productController = require("./controllers/ProductController");
const invoiceController = require("./controllers/invoiceController");
const userController = require("./controllers/UserController");
//declaring mongoose
const mongoose = require("mongoose");

//mongoose connection string
 const uri = "mongodb+srv://member-A02:PFhtLJ2GXqcHb9jo@billing-a02.xtm7iin.mongodb.net/profiles-db?retryWrites=true&w=majority";

 //load indexRouter
const indexRouter = require("./routers/indexRouter");
const userRouter = require("./routers/userRouter");
const secureRouter = require("./routers/secureRouter");
const productsRouter = require("./routers/productsRouter");
const profilesRouter = require("./routers/profilesRouter");
const invoicesRouter = require("./routers/invoicesRouter");

// set up default mongoose connection
mongoose.connect(uri);

// store a reference to the default connection
const db = mongoose.connection;

//console log to make sure connection is established
db.once("open", function(){
  console.log("Connected to Mongo")
})

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//set up session management
app.use(require("express-session")({
  secret: "winter break was never the same at this point",
  resave: false,
  saveUninitialized: false,
}));

// Initialize passport and configure for User model
app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/User");
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//tell express where to find templates(views)
app.set("views", path.join(__dirname, "views"));
//set view engine to ejs
app.set("view engine", "ejs");

//import express ejs layouts
const expressLayouts = require("express-ejs-layouts");
//use ejs layout
app.use(expressLayouts);
//set default layout
app.set("layout", "layouts/full-width");

//morgan logging middleware
const logger = require("morgan");
//use logger as middleware
app.use(logger("dev"));

//parse applicaion form-urlencoded
const bodyParser = require("body-parser");
const { profile } = require("console");
const Profile = require("./models/Product");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//express static middleware : making the public folder globally accessible
app.use(express.static("public"));

//Search routes
app.get("/profiles/search", profileController.searchProfiles);
app.get("/products/search", productController.searchProducts);
app.get("/invoices/search", invoiceController.searchInvoice);
app.get("/user/search", userController.searchUser);

//routes
app.use("/", indexRouter);
app.use("/user", userRouter); 
app.use("/secure", secureRouter);
app.use("/products", productsRouter);
app.use("/profiles", profilesRouter);
app.use("/invoices", invoicesRouter);

//catch any unmatched routes
app.all("/*", (req, res) => {
  res.status(404).send("File not found.");
});

//start listening to port
app.listen(port, () => console.log(`app listening on port ${port}!`));

