const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../data/RequestService");
const UserOps = require("../data/UserOps");
const _userOps = new UserOps();
const InvoiceOps = require("../data/InvoiceOps");
const _invoiceOps = new InvoiceOps();

exports.searchUser = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated){
        console.log("searching for user");
        const searchQuery = req.query.q;

        try {
            const users = await _userOps.find({
                username: { $regex: searchQuery, $options: "i" },
            });

            res.render("userprofiles", {
                title: "User Search",
                users: users,
                reqInfo: reqInfo,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.redirect("/user/login?errorMessage=You must be logged in to view this page.")
    }
};


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
            roles: req.body.roles || "User",
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
                res.redirect("/user/userprofiles");
              
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
                roles: req.body.roles,
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

exports.UserDetail = async function (request, response) {
    let reqInfo = RequestService.reqHelper(request);
    if (reqInfo.authenticated){
      const userId = request.params.id;
    console.log(`loading single user by id ${userId}`);
    let user = await _userOps.getUserById(userId);
    console.log("USER ID IN USER DETAIL: ", user);
    let users = await _userOps.getAllUsers();
  
    if (user) {
      response.render("userprofile-details", {
        title: "User Detail - " + user.username,
        users: users,
        userId: userId,
        user: user,
        layout: "layouts/full-width",
        reqInfo: reqInfo,
      });
    } else {
      response.render("userprofile-details", {
        title: "User Detail - " + user.username,
        users: [],
        layout: "layouts/full-width",
        reqInfo: reqInfo,
      });
    }
    } else {
      response.redirect("/user/login?errorMessage=You must be logged in to view this page.")
    }
  };

  exports.UserEdit = async function (request, response) {
    let reqInfo = RequestService.reqHelper(request);
    if (reqInfo.authenticated){
        const userId = request.params.id;
        let user = await _userOps.getUserById(userId);
        console.log("USER ID IN USER EDIT: ", user);

        response.render("userprofile-detailsform", {
        title: "Edit User Profile",
        errorMessage: "",
        userId: userId,
        user: user,
        reqInfo: reqInfo,
        // roles: user.roles,

      });
    }else {
      response.redirect("/user/login?errorMessage=You must be logged in to view this page.")
    }
  };

  exports.UserUpdate = async function (request, response) {
    let reqInfo = RequestService.reqHelper(request);
    if (reqInfo.authenticated){
    const userId = request.params.id;
    let user = await _userOps.getUserById(userId);
    const userObj = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      username: request.body.username,
      reqInfo: reqInfo,
      userId: userId,
      user: user,
      roles: request.body.roles,
    };
  
    console.log(`This is the user id${userId}`);
    console.log("USER ROLE IN UPDATE: ", user.roles);
  
    let responseObj = await _userOps.updateUserById(userId, userObj);
  
    if (responseObj.errorMsg == "") {
      let users = await _userOps.getAllUsers();
      response.render("userprofiles", {
        title: "Users",
        users: users,
        reqInfo,
      });
    } else {
      console.log("An error occured. User was not updated.");
      response.render("userprofile-detailsform", {
        title: "Edit User Profile",
        user: responseObj.obj,
        userId: userId,
        errorMessage: responseObj.errorMsg,
        reqInfo: reqInfo,
      });
    }
  } else {
    response.redirect("/user/login?errorMessage=You must be logged in to view this page.")
  } 
};

  
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

  exports.Users = async function (request, response) {
    let reqInfo = RequestService.reqHelper(request);
    if (reqInfo.authenticated){
      console.log("loading users from controller");
      let users = await _userOps.getAllUsers();
      if (users) {
        response.render("userprofiles", {
          title: "Users",
          users: users,
          layout: "layouts/full-width",
          reqInfo: reqInfo,
        });
      } else {
        response.render("userprofiles", {
          title: "Users",
          users: [],
          reqInfo: reqInfo,
        });
      }
    }else {
      response.redirect("/user/login?errorMessage=You must be logged in to view this page.")
    }
  };
  
  // Handle profile form GET request
exports.DeleteUserById = async function (request, response) {
    let reqInfo = RequestService.reqHelper(request);
    if (reqInfo.authenticated){
      const userId = request.params.id;
      console.log(`deleting single user by username: ${userId}`);
      let deletedUser = await _userOps.deleteUserById(userId);
      let users = await _userOps.getAllUsers();
    
      if (deletedUser) {
        response.render("userprofiles", {
          title: "Users",
          users: users,
          errorMessage: "",
          layout: "layouts/full-width",
          reqInfo: reqInfo,
        });
      } else {
        response.render("userprofiles", {
          title: "Users",
          users: users,
          errorMessage: "Error.  Unable to delete user",
          layout: "layouts/full-width",
          reqInfo: reqInfo,
        });
      }
    } else {
      response.redirect("/user/login?errorMessage=You must be logged in to view this page.")
    }
  };