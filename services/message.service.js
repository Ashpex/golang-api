const Message = require("../models/message.model.js");
const Group = require("../models/group.model.js");

exports.createMessage = async (message) => {
  const newMessage = new Message({
    userId: message.userId,
    groupId: message.groupId,
    content: message.content,
    createdAt: Date.now(),
  });
  const result = await newMessage.save();
  return result;
};

exports.getAllMessages = async (groupId) => {
  const group = await Group.findOne({ _id: groupId });

  if (group) {
    const messages = await Message.find({ groupId: group._id });
    return messages;
  } else {
    return [];
  }
};
