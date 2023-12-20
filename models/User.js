const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passwordValidator = require("password-validator");

//schema for password validation
const passwordSchema = new passwordValidator();

// Add password validation rules
passwordSchema
    .is().min(8)            // Minimum length 8
    .has().uppercase()      // Must have uppercase letters
    .has().lowercase()      // Must have lowercase letters
    .has().digits(1)        // Must have at least 1 digit
    .has().symbols(1)       // Must have at least 1 symbol
    .has().not().spaces();  // Should not have spaces

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
        validate: {
            validator: function(password) {
                return passwordSchema.validate(password);
            },
            message: "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 symbol, and should not have spaces.",
        },
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