const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../data/RequestService");
const UserOps = require("../data/UserOps");
const _userOps = new UserOps();
const InvoiceOps = require("../data/InvoiceOps");
const _invoiceOps = new InvoiceOps();

//displays registration form
exports.Register = async function (req, res){
    let reqInfo = RequestService.reqHelper(req);
    res.render("register", {errorMessage: "", user: {}, reqInfo: reqInfo});
};

//POST with registration form submission
exports.RegisterUser = async function(req, res){
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    if (password == passwordConfirm){
        //create user object with mongoose model
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
        });
        //user passport to register user 
        //pass in user object without password
        //and password as next parameter
        User.register(
            new User(newUser),
            req.body.password,
            function (err, account){
                //show registration form with errors if fails
                if (err){
                    let reqInfo = RequestService.reqHelper(req);
                    return res.render("register", {
                        user: newUser,
                        errorMessage: err,
                        reqInfo: reqInfo,
                    });
                }
                //when user registration is successful, authenticate and redirect to home page
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/");
                });
            }
        );
    } else {
        let reqInfo = RequestService.reqHelper(req);
        res.render("register", {
            user: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                username: req.body.username,
            },
            errorMessage: "Passwords do not match.",
            reqInfo: reqInfo,
        });
    }
};

//display login form 
exports.Login = async function(req,res){
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;
    res.render("login", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo
    });
};

//getting login information, authenticate, and redirect (pass/fail)
exports.LoginUser = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "userprofile", 
        failureRedirect: "login?errorMessage=Invalid login.",
    })(req, res, next);
};

//Logout user and redirect to login page
exports.Logout = (req, res) => {
    //use passports logout function
    req.logout((err) => {
        if (err) {
            console.log("logout error");
            return next(err);
        } else {
            //when logged out update reqInfo and redirect to login page
            let reqInfo = RequestService.reqHelper(req);
            res.render("login", {
                user: {},
                isLoggedIn: false,
                errorMessage: "",
                reqInfo: reqInfo,
            })
        }
    })
}

//user profile display
exports.Profile = async function(req, res){
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated){
        let roles = await _userOps.getRolesByUsername(reqInfo.username);
        console.log("roles in user controller: ", roles)
        let sessionData = req.session;
        sessionData.roles = roles;
        reqInfo.roles = roles;
        let userInfo = await _userOps.getUserByUsername(reqInfo.username);
        return res.render("userprofile", {
            reqInfo: reqInfo,
            userInfo: userInfo,
         
        });
    } else {
         res.redirect("/user/login?errorMessage=You must be logged in to view this page.");
    }
};

// Render the user profile edit form
exports.ProfileEdit = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {
        // Fetch the user's current information to pre-fill the form
        let userInfo = await _userOps.getUserByUsername(reqInfo.username);
        console.log("TEST", userInfo);
        res.render("userprofile-form", {
            reqInfo: reqInfo,
            userInfo: userInfo,
            errorMessage: "",
        });
    } else {
        res.redirect("/user/login?errorMessage=You must be logged in to view this page.");
    }
};

// Update the user's profile information
exports.ProfileUpdate = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {
        try {
            // Collect the updated information from the form
            const updatedUserInfo = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                // Add other fields to update as needed
            };

            // Call the function to update the user's information
            await _userOps.updateUserByUsername(reqInfo.username, updatedUserInfo);

            // Fetch the updated user information
            let userInfo = await _userOps.getUserByUsername(reqInfo.username);

            // Render the profile page with updated information
            res.render("userprofile", {
                reqInfo: reqInfo,
                userInfo: userInfo,
                successMessage: "Profile updated successfully!",
            });
        } catch (error) {
            // Handle any errors that occur during the update process
            res.render("profileEdit", {
                reqInfo: reqInfo,
                userInfo: req.body,
                errorMessage: "Failed to update profile. Please try again.",
            });
        }
    } else {
        res.redirect("/user/login?errorMessage=You must be logged in to view this page.");
    }
};

exports.displayInvoices = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {
      try {
        // Fetch the updated user information
        let userInfo = await _userOps.getUserByUsername(reqInfo.username);
        const firstName = userInfo.user.firstName;
        const lastName = userInfo.user.lastName;
  
        // Create a regular expression pattern to match both first and last names within invoiceName
        const searchQuery = new RegExp(`\\b${firstName}\\b.*\\b${lastName}\\b`, "i");
  
        const invoices = await _invoiceOps.find({
          invoiceName: searchQuery,
        });
  
        res.render("my-invoice", {
          title: "My Invoices",
          invoices: invoices,
          reqInfo: reqInfo,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.redirect("/user/login?errorMessage=You must be logged in to view this page.");
    }
  };
  