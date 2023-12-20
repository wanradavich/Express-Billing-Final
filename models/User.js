const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passwordValidator = require("password-validator");

//password schema
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)                                    // Minimum length
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().symbols()                                // Must have symbols
    .is().not().oneOf(['Passw0rd', 'Password123']); // Avoid common passwords

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
            validator: function (value) {
                return passwordSchema.validate(value);
            },
            message: props =>
                `Password must have at least 8 characters, including uppercase, lowercase, digits, and symbols.`,
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

// Adding passport-local-mongoose to schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

// Exporting the model to use in the app
module.exports = User;
