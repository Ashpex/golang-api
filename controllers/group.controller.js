const GroupService = require("../services/group.service");
const EmailService = require("../services/email.service");
const UserService = require("../services/user.service");

exports.getGroupsOwner = async (req, res) => {
  try {
    const groups = await GroupService.findAllGroupsOwnedByUserId(
      req.params.userId
    );
    if (groups) {
      res.status(200).json(groups);
    } else {
      res.status(404).json({ message: "Groups not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await GroupService.findGroupById(req.params.id);
    if (group) {
      res.status(200).json(group);
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllGroupsByUserId = async (req, res) => {
  try {
    const groups = await GroupService.findAllGroupsByUserId(req.params.id);
    if (groups) {
      res.status(200).json(groups);
    } else {
      res.status(404).json({ message: "Groups not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const group = await GroupService.createGroup(req.body);
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const group = await GroupService.updateGroup(req.body);
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await GroupService.deleteGroup(req.params.id);
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.isInGroup = async (req, res) => {
  try {
    const isInGroup = await GroupService.isInGroup(
      req.params.userId,
      req.params.groupId
    );
    res.status(200).json(isInGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.inviteUserByEmail = async (req, res) => {
  try {
    const group = await GroupService.findGroupById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const user = await UserService.findUserByEmail(req.body.email);

    if (user) {
      const isInGroup = await GroupService.isInGroup(user._id, group._id);
      if (isInGroup) {
        return res.status(400).json({ message: "User already in group" });
      } else {
        const url = `${process.env.CLIENT_URL_DEV}/group/join?groupId=${group._id}&email=${req.body.email}&role=${req.body.userRole}`;

        await EmailService.sendEmail(req.body.email, {
          groupName: group.name,
          subjectMail: "Invitation to join group",
          titleContentMail: "You have been invited to join group",
          url,
        });

        res.status(200).json({ message: "Invitation sent" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const group = await GroupService.findGroupById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const user = await UserService.findUserByEmail(req.body.email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isInGroup = await GroupService.isInGroup(user._id, group._id);

    if (isInGroup) {
      return res.status(400).json({ message: "User already in group" });
    }

    const groupUser = await GroupService.addUserToGroup(
      group._id,
      user._id,
      req.body.userRole
    );

    res.status(200).json(groupUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
