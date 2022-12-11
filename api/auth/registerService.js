const registerModel = require("./registerModel");

exports.updateUserPassword = async (email, password) => {
  const data = await registerModel.udpateUserPassword(email, password);
  return data;
};

exports.getUserByEmail = async (email) => {
  const data = await registerModel.checkExistUserByEmail(email);
  return data;
};

exports.create = async (userObj) => {
  const data = await registerModel.create(userObj);
  return data;
};
