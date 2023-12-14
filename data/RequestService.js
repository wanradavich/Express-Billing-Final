class RequestService {
    constructor() {}

    // Get user from request object
    reqHelper(req) {
        if (req.isAuthenticated()) {
            // Sends username and login status to view if authenticated
            return { authenticated: true, username: req.user.username };
        } else {
            // Sends logged out status to the view if not authenticated
            return { authenticated: false, username: null }; // You can adjust the data accordingly
        }
    }
}

module.exports = new RequestService();
