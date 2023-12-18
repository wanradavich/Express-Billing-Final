const mongoose = require("mongoose");
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
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
    },
    {collection: "profiles"}
);
// profileSchema.plugin(passportLocalMongoose);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;


