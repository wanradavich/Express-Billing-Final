const RequestService = require("../data/RequestService");


//function to render the secure area if user is authenticated
exports.Index = async function(req, res){
    let reqInfo = RequestService.reqHelper(req);

    if (reqInfo.authenticated){
        //reqInfo check
        console.log("reqInfo in controller: ",reqInfo)
        return res.render("secure-area", {
            reqInfo: reqInfo
        }); 
    } else {
        //redirect to login if not authenticated
        res.redirect("user/login?errorMessage=You must be logged in to view this page.")
    }
}

