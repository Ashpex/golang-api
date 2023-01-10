const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/message.controller");

router.post("/", MessageController.createMessage);

// get all messages by group id
router.get("/", MessageController.getAllMessages);

module.exports = router;
