const UserServices = require("../services/user.service");
const EmailServices = require("../services/email.service");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const user = await UserServices.login(req.body.email, req.body.password);
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
    } else if (user.isEmailVerified) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Please verify your email" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const user = await UserServices.register(req.body);
    if (user) {
      const token = await UserServices.generateJWT(user);
      const url = `${process.env.CLIENT_URL_DEV}/user/verify-email/${token}`;
      await EmailServices.sendEmail(user.email, {
        subjectMail: "Verify your email",
        titleContentMail: "Verify your email to finish signing up",
        url,
        isEmailVerified: true,
      });

      res.status(201).json(user);
    } else {
      res.status(400).json({ message: "User already exists" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await UserServices.changePassword(
      req.body.user_id,
      req.body.old_password,
      req.body.new_password
    );
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await UserServices.resetPassword(req.decoded);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: req.body.tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = await UserServices.googleLogin(payload);
    if (user) {
      user.password = undefined;
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await UserServices.verifyEmail(req.params.token);
    if (user) {
      res.status(200).json({ message: "Email verified", user });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await UserServices.findUserByEmail(req.body.email);
    if (user) {
      const token = await UserServices.generateJWT(user);
      const url = `${process.env.CLIENT_URL_DEV}/user/reset-password/${token}`;
      console.log("url", url);
      await EmailServices.sendEmail(user.email, {
        subjectMail: "Reset your password",
        titleContentMail: "Reset your password",
        url,
      });
      res.status(200).json({ message: "Email sent" });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPasswordToken = async (req, res) => {
  const token = req.params.token;
  console.log("token", token);
  const newPassword = req.body.password;
  const user = await UserServices.resetPasswordToken(token, newPassword);

  if (user) {
    res.status(200).json({ message: "Password reset successfully" });
  } else {
    res.status(400).json({ message: "Please email check again" });
  }
};
