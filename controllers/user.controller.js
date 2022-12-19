const UserServices = require("../services/user.service");
const RoleInGroup = require("../enums/RoleInGroup.enum");

exports.findAll = async (req, res) => {
  try {
    const users = await UserServices.findAll();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "Users not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = await UserServices.findOne(String(req.params.userId));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const user = await UserServices.create(req.body);
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(400).json({ message: "User already exists" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const user = await UserServices.updateById(req.params.userId, req.body);
    if (user) {
      user.password = undefined;
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const user = await UserServices.delete(req.params.userId);
    if (user) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await UserServices.changePassword(
      req.params.userId,
      req.body.oldPassword,
      req.body.newPassword
    );
    if (user) {
      res.status(200).json({ message: "Password changed successfully" });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.joinGroupRoleMember = async (req, res) => {
  try {
    const user = await UserServices.joinGroup(
      req.body.user_id,
      req.body.group_id,
      RoleInGroup.MEMBER
    );
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.joinGroupRoleOwner = async (req, res) => {
  try {
    const user = await UserServices.joinGroup(
      req.body.user_id,
      req.body.group_id,
      RoleInGroup.OWNER
    );
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.joinGroupRoleCoOwner = async (req, res) => {
  try {
    const user = await UserServices.joinGroup(
      req.body.user_id,
      req.body.group_id,
      RoleInGroup.CO_OWNER
    );
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const user = await UserServices.leaveGroup(
      req.body.user_id,
      req.body.group_id
    );
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
