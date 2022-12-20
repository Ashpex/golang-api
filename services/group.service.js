const Group = require("../models/group.model");
require("dotenv").config();

exports.findAllGroupByUserId = async (userId) => {
  return await Group.find({ "usersAndRoles.user": userId });
};

exports.findAll = async () => {
  return await Group.find();
};

exports.findGroupById = async (groupId) => {
  return await Group.findById(groupId);
};

exports.createGroup = async (group) => {
  const newGroup = new Group(group);
  return await newGroup.save();
};

exports.updateGroup = async (group) => {
  const updated = await Group.findByIdAndUpdate(group._id, group, {
    new: true,
  });
  return updated;
};

exports.deleteGroup = async (groupId) => {
  const deleted = await Group.findByIdAndDelete(groupId);
  return deleted;
};

exports.isInGroup = async (userId, groupId) => {
  const group = await Group.findById(groupId);
  if (group) {
    return group.usersAndRoles.some((user) => user.user == userId);
  } else {
    return false;
  }
};
