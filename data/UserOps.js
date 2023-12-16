const User = require("../models/User");
const Invoice = require("../models/Invoice");

class UserOps {
    UserData(){}

    async getUserByEmail(email){
        let user = await User.findOne({email: email});
        if (user){
            const response = {obj: user, errorMessage: ""};
            return response;
        } else {
            return null;
        }
    }

    async getUserByUsername(username){
        let user = await User.findOne(
            {username: username},
            {_id: 0, username: 1, email: 1, firstName: 1, lastName: 1}
            );
        if (user){
            const response = {user: user, errorMessage: ""};
            return response;
        } else {
            return null;
        }
    }

    async getRolesByUsername(username){
        let user = await User.findOne({ username: username}, {_id: 0, roles: 1, });
        if (user.roles){
            return user.roles;
        } else {
            return [];
        }
    }

    async updateUserByUsername(username, updatedUserInfo){
        try{
            const user = await User.findOneAndUpdate(
                {username: username},
                {$set: updatedUserInfo},
                {new: true},
                );
                if(user){
                    const response = {user: user, errorMessage: ""};
                    return response;
                } else {
                    return null;
                }
        }catch (error){
            return {user: null, errorMessage: error.message};
        }
    }

    async findUserInvoicesByName(userName){
        try {
            const invoices = await Invoice.find({invoiceName: userName});
            return invoices;
        } catch (error) {
            console.error(error);
            return [];
        }
        
    }

  
}

module.exports = UserOps;