const UserServices = require("../services/user.service");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const user = await UserServices.login(req.body.email, req.body.password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const user = await UserServices.register(req.body);
    if (user) {
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
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = await UserServices.googleLogin(payload);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
