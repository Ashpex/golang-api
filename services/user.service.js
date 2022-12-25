const User = require("../models/user.model");
const Group = require("../models/group.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.findAll = async () => {
  return await User.find();
};

exports.findOne = async (userId) => {
  const user = await User.findById(userId);
  user.password = undefined;

  return user;
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

exports.create = async (user) => {
  const existing = await User.findOne({ email: user.email });
  if (existing) {
    return null;
  }
  const newUser = new User(user);
  return await newUser.save();
};

exports.updateById = async (userId, user) => {
  const existingUser = await User.findById(userId);
  if (existingUser) {
    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
    });
    updatedUser.password = undefined;
    return updatedUser;
  } else {
    return null;
  }
};

exports.delete = async (userId) => {
  const existingUser = await User.findById(userId);
  if (existingUser) {
    return await User.findByIdAndRemove(userId);
  } else {
    return null;
  }
};

exports.generateJWT = async (user) => {
  const payload = {
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.verifyEmail = async (verificationCode) => {
  const decoded = jwt.verify(verificationCode, process.env.JWT_SECRET);
  const user = await User.findOne({ email: decoded.email });
  if (user) {
    user.isEmailVerified = true;
    await user.save();
    user.password = undefined;
    return user;
  } else {
    return false;
  }
};

exports.isInGroup = async (userId, groupId) => {
  const user = await User.findById(userId);
  if (user) {
    const group = await Group.findById(groupId);
    if (group) {
      return user.groups.includes(groupId);
    } else {
      return false;
    }
  } else {
    return false;
  }
};

exports.joinGroup = async (userId, groupId, roleInGroup) => {
  const user = await User.findById(userId);
  if (user) {
    const group = await Group.findById(groupId);
    if (group) {
      user.groups.push(groupId);
      await user.save();
      group.usersAndRoles.push({
        user: userId,
        role: roleInGroup,
      });
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

exports.leaveGroup = async (userId, groupId) => {
  const user = await User.findById(userId);
  if (user) {
    const group = await Group.findById(groupId);
    if (group) {
      user.groups = user.groups.filter((group) => group != groupId);
      await user.save();
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

exports.findMyGroups = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    return await Group.find({ _id: { $in: user.groups } });
  } else {
    return [];
  }
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (user) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (isMatch) {
      user.password = bcrypt.hashSync(newPassword, 10);
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      return updatedUser;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

exports.resetPassword = async (decoded) => {
  const user = await User.findOne({ email: decoded.email });
  if (user) {
    user.password = bcrypt.hashSync("123456", 10);
    await user.save();
    user.password = undefined;
    return true;
  } else {
    return false;
  }
};

exports.login = async (email, password) => {
  const user = await User.findOne({
    email: email,
    isLoggedInWithGoogle: false,
  });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = await this.generateJWT(user);
      user.password = undefined;
      return { user, token, isEmailVerified: user.isEmailVerified };
    } else {
      return null;
    }
  } else {
    return null;
  }
};

exports.register = async (user) => {
  const existing = await User.findOne({ email: user.email });
  if (existing) {
    return null;
  }
  const newUser = new User({
    ...user,
    isLoggedInWithGoogle: false,
    password: await bcrypt.hash(user.password, 10),
  });
  const savedUser = await newUser.save();
  savedUser.password = undefined;
  return savedUser;
};

exports.googleLogin = async (payload) => {
  const user = await User.findOne({
    email: payload.email,
    isLoggedInWithGoogle: true,
  });
  if (user) {
    const token = await this.generateJWT(user);
    user.password = undefined;
    return { user, token };
  } else {
    const newUser = new User({
      name: payload.name,
      email: payload.email,
      avatarUrl: payload.picture,
      isEmailVerified: true,
      description: "",
      isLoggedInWithGoogle: true,
      groups: [],
    });
    const savedUser = await newUser.save();
    const token = await this.generateJWT(savedUser);
    savedUser.password = undefined;
    return { user: savedUser, token };
  }
};
