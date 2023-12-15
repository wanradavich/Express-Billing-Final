const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../data/RequestService");
const UserOps = require("../data/UserOps");
const _userOps = new UserOps();

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
        failureRedirect: "user/login?errorMessage=Invalid login.",
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