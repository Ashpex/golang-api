const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.post("/login", AuthController.login);

router.post("/register", AuthController.register);

router.post("/forgot-password", AuthController.forgotPassword);

router.get("/verify-email/:token", AuthController.verifyEmail);

router.post("/reset-password/:token", AuthController.resetPasswordToken);

router.post("/google", AuthController.googleLogin);

module.exports = router;
