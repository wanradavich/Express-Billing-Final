const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    roles: {
        type: Array,
    },  
});
//Adding passport-local-mongoose to schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

//exporting the model to use in app
module.exports = User;