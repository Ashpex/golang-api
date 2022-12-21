const GroupService = require("../services/group.service");

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

exports.getGroupsByUserId = async (req, res) => {
  try {
    const groups = await GroupService.findAllGroupByUserId(req.params.id);
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
