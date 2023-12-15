class RequestService {
    RequestService() {}

    // Get user from request object
    reqHelper(req, permittedRoles = []) {
        //restrict permission by default
        let rolePermitted = false;

        //send username and login status to view if authenticated
        if (req.isAuthenticated()) {
            if (req.session.roles){
                //check if user role match any of permitted roles for request
                let matchingRoles = req.session.roles?.filter((role) =>
                    permittedRoles.includes(role)
                );
                if (matchingRoles.length > 0){
                    rolePermitted = true;
                }
            } else {
                req.session.roles = [];
            }
            // Sends username and login status to view if authenticated
            return { 
                authenticated: true, 
                username: req.user.username,
                roles: req.session.roles,
                rolePermitted: rolePermitted, 
            };
        } else {
            // Sends logged out status to the view if not authenticated
            return { authenticated: false,}; 
        }
    }
}

module.exports = new RequestService();
