const RequestService = require("../data/RequestService");
// const UserOps = require("../data/UserOps");
// const _userOps = new UserOps();


exports.Index = async function(req, res){
    let reqInfo = RequestService.reqHelper(req);

    if (reqInfo.authenticated){
        //reqInfo check
        console.log("reqInfo in controller: ",reqInfo)
        return res.render("secure-area", {
            reqInfo: reqInfo
        }); 
    } else {
        res.redirect("login?errorMessage=You must be logged in to view this page.")
    }
}

//Admin area is available only to users whose role is admin.
exports.Admin = async function(req, res){
    let reqInfo = RequestService.reqHelper(req, ["Admin"]);
    if (reqInfo.rolePermitted){
        res.render("secure/admin-area", {
            errorMessage: "",
            reqInfo: reqInfo
        });
    } else {
        res.redirect("/user/login?errorMessage=You must be an admin to access this area.")
    }
}

//Manager area is available only to users whose role is admin.
exports.Manager = async function (req, res){
    let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
    if (reqInfo.rolePermitted){
        res.render("secure/manager-area", { errorMessage: "", reqInfo: reqInfo});
    } else {
        res.redirect("/user/login?errorMessage=You must be a manager or admin to access this area.");
    }
};