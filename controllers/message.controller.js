const MessageService = require("../services/message.service");

exports.createMessage = async (req, res) => {
  const message = req.body;
  try {
    const result = await MessageService.createMessage(message);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// get all messages by group id
exports.getAllMessages = async (req, res) => {
  const groupId = req.query.groupId;
  try {
    const result = await MessageService.getAllMessages(groupId);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
