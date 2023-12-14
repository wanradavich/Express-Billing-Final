const mongoose = require("mongoose");
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
}
    },
    {collection: "profiles"}
);
const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;


