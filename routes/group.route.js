const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/group.controller");

router.get("/", GroupController.getGroups);

router.get("/:id", GroupController.getGroupById);

router.get("/user/:id", GroupController.getGroupsByUserId);

router.post("/", GroupController.createGroup);

router.put("/:id", GroupController.updateGroup);

router.delete("/:id", GroupController.deleteGroup);

router.get("/isInGroup/:userId/:groupId", GroupController.isInGroup);

module.exports = router;