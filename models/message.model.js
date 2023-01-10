const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  groupId: {
    type: Schema.Types.ObjectId,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
