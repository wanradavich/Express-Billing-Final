const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../data/RequestService");

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