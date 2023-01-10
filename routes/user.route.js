const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/", UserController.findAll);

router.get("/:userId", UserController.findOne);

router.post("/", UserController.create);

router.put("/:userId", UserController.updateById);

router.delete("/:userId", UserController.delete);

router.put("/change-password/:userId", UserController.changePassword);

router.put("/reset-password", UserController.resetPassword);

module.exports = router;
