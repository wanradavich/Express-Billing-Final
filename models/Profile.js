const mongoose = require("mongoose");
const User = require("../models/User");
// const passportLocalMongoose = require("passport-local-mongoose");
const profileSchema = new mongoose.Schema({
  
    name: {
        type: "String",
        required: true,
    },
    code: {
      type: "String",
      required: true,
    },
    company: {
      type: "String",
      required: true,
  },
    email: {
      type: "String",
      required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
    },
    {collection: "profiles"}
);
// profileSchema.plugin(passportLocalMongoose);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;


