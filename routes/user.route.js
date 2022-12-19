const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/", UserController.findAll);

router.get("/:userId", UserController.findOne);

router.post("/", UserController.create);

router.put("/:userId", UserController.updateById);

router.delete("/:userId", UserController.delete);

module.exports = router;
