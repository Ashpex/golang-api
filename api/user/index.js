const express = require("express");
const router = express.Router();
const userController = require("./userController");

function isAdmin(req, res, next) {
  console.log(req.user);
  if (req.user.role) {
    console.log("isAdmin");
    next();
  } else res.status(401).send("Admin only");
}

router.post("/", userController.updateProfile);

router.post("/change-password", userController.changePassword);

router.get("/admins", isAdmin, userController.getAdmins);

router.get("/users", isAdmin, userController.getUsers);

router.get("/all-users", isAdmin, userController.getAllUsers);

router.post("/admins", isAdmin, userController.createAdmin);

router.put("/update-status", isAdmin, userController.updateStatusUser);

router.put("/update-student-code", isAdmin, userController.updateStudentCode);

router.get("/users/count", isAdmin, userController.getUsersCount);

module.exports = router;
