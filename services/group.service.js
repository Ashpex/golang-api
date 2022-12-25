const Group = require("../models/group.model");
const User = require("../models/user.model");
const RoleInGroup = require("../enums/RoleInGroup.enum");
require("dotenv").config();

exports.findAllGroupByUserId = async (userId) => {
  return await Group.find({ "usersAndRoles.user": userId });
};

exports.findAllGroupsOwnedByUserId = async (userId) => {
  return await Group.find({
    userCreated: userId,
    usersAndRoles: {
      $elemMatch: {
        user: userId,
        role: RoleInGroup.OWNER,
      },
    },
  });
};

exports.findGroupById = async (groupId) => {
  const group = await Group.findById(groupId);
  const users = await User.find({
    _id: { $in: group.usersAndRoles.map((user) => user.user) },
  });

  users.forEach((user) => {
    user.password = undefined;
  });

  return {
    ...group._doc,
    usersAndRoles: group.usersAndRoles.map((userAndRole, index) => {
      return {
        ...userAndRole._doc,
        user: users[index],
      };
    }),
  };
};

exports.createGroup = async (group) => {
  const newGroup = new Group({
    name: group.name,
    description: group.description,
    userCreated: group.createdUserId,
    usersAndRoles: [
      {
        user: group.createdUserId,
        role: RoleInGroup.OWNER,
      },
    ],
  });
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
    return group.usersAndRoles.some(
      (user) => user.user.toString() === userId.toString()
    );
  } else {
    return false;
  }
};

exports.addUserToGroup = async (groupId, userId, userRole) => {
  const group = await Group.findById(groupId);
  if (group) {
    const user = await User.findById(userId);
    if (user) {
      const userAndRole = {
        user: userId,
        role: userRole,
      };
      group.usersAndRoles.push(userAndRole);
      await group.save();

      user.groups.push(groupId);
      await user.save();

      user.password = undefined;
      return {
        ...group._doc,
        newMember: user,
      };
    } else {
      throw new Error("User not found");
    }
  } else {
    throw new Error("Group not found");
  }
};
