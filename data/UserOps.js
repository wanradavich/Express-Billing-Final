const User = require("../models/User");
const Invoice = require("../models/Invoice");

class UserOps {
    UserData(){}

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

    async getUserByEmail(email){
        let user = await User.findOne({email: email});
        if (user){
            const response = {obj: user, errorMessage: ""};
            return response;
        } else {
            return null;
        }
    }

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

    async findUserInvoicesByName(userName){
        try {
            const invoices = await Invoice.find({invoiceName: userName});
            return invoices;
        } catch (error) {
            console.error(error);
            return [];
        }
        
    }

    async deleteUserById(id) {
        console.log(`deleting user by id ${id}`);
        let result = await User.findByIdAndDelete(id);
        console.log(result);
        return result;
      }

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