const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: String,
  name: { type: String, default: "New User" },
  password: String,
  avatarUrl: String,
  description: String,
  isLoggedInWithGoogle: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  groups: [{ type: Schema.Types.ObjectId }],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
