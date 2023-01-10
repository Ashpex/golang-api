const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GroupSchema = new Schema({
  name: { type: String, default: "New Group" },
  description: { type: String, default: "New Description" },
  usersAndRoles: [{ user: Schema.Types.ObjectId, role: String }],
  userCreated: { type: Schema.Types.ObjectId },
  userUpdated: { type: Schema.Types.ObjectId },
});

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
