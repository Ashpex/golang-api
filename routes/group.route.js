const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/group.controller");

router.get("/owner/:userId", GroupController.getGroupsOwner);

router.get("/:id", GroupController.getGroupById);

router.get("/users/:id", GroupController.getAllGroupsByUserId);

router.post("/", GroupController.createGroup);

router.put("/:id", GroupController.updateGroup);

router.delete("/:id", GroupController.deleteGroup);

router.get("/isInGroup/:userId/:groupId", GroupController.isInGroup);

router.post("/invite/:groupId", GroupController.inviteUserByEmail);

router.post("/joinGroup/:groupId", GroupController.joinGroup);

router.get("/:groupId/remove/:userId", GroupController.removeUser);

router.get("/:groupId/leaveGroup/:userId", GroupController.removeUser);

router.post("/:groupId/changeRole/:userId", GroupController.changeUserRole);

router.delete("/:groupId", GroupController.deleteGroup);

module.exports = router;
