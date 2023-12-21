const RequestService = require("../data/RequestService");

//rendering home page
exports.Index = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    return res.render("home", {
        reqInfo: reqInfo,
        title: "Home Page",
        layout: "layouts/full-width",
    });
}