const User = require("../models/User");
const Invoice = require("../models/Invoice");

class UserOps {
    UserData(){}

    //get all users
    async getAllUsers() {
        try{
          console.log("fetching all users");
        const users = await User.find({}).sort({username: 1});
        return users;
        } catch (error){
          console.error("Error fetching users: ", error);
          throw error;
        }
      }

    //get user by email
    async getUserByEmail(email){
        let user = await User.findOne({email: email});
        if (user){
            const response = {obj: user, errorMessage: ""};
            return response;
        } else {
            return null;
        }
    }

    //get user by their id
    async getUserById(id) {
        try{
          console.log("fetching user by id")
          const user = await User.findById(id);
          return user;
        } catch (error){
          console.error("Error fetching users by id: ", error);
          throw error;
        }
      }

    //get user by username
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

    //get roles by username
    async getRolesByUsername(username){
        let user = await User.findOne({ username: username}, {_id: 0, roles: 1, });
        if (user.roles){
            return user.roles;
        } else {
            return [];
        }
    }

    //update user by username (user side)
    async updateUserByUsername(username, updatedUserInfo){
        try{
          //find one username match
            const user = await User.findOneAndUpdate(
              //find user by username
                {username: username},
                //set new user with updated information
                {$set: updatedUserInfo},
                //return upated document
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

    //update user by Id (admin side)
    async updateUserById(id, userObj) {
        console.log(`updating user by id ${id}`);
        const user = await User.findById(id);
        for (const key in userObj) {
          user[key] = userObj[key]
        }
        console.log("original user: ", user);
        let result = await user.save();
        console.log("updated user: ", result);
        return {
          obj: result,
          errorMsg: "",
        };
      }

    //find user invoice by name (for users to view their invoices in "my-invoice")
    async findUserInvoicesByName(userName){
        try {
            const invoices = await Invoice.find({invoiceName: userName});
            return invoices;
        } catch (error) {
            console.error(error);
            return [];
        }
        
    }

    //delete user by id (admin side)
    async deleteUserById(id) {
        console.log(`deleting user by id ${id}`);
        let result = await User.findByIdAndDelete(id);
        console.log(result);
        return result;
      }

    //find search query 
    async find(query) {
        try {
          const users = await User.find(query);
          return users;
        } catch (error) {
          throw new Error(`Error finding products: ${error.message}`);
        }
      }
  
}

module.exports = UserOps;