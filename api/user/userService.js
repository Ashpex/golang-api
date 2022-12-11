const userModel = require("./userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const classModel =  require("../classes/classModel");

exports.updateProfile = async (userObj) => {
  const userInfo = await classModel.getInfoUserById(userObj.id);
  const ifExistStudentId = await userModel.checkStudentId(userObj.student_id);
  if (ifExistStudentId && ifExistStudentId.id !== userObj.id) return null;
  else {
    const result1 = await userModel.updateStudentCodeInClassSTC(userObj.student_id, userInfo.student_id);
    const result2 = await userModel.updateStudentCodeInSyllabus(userObj.student_id, userInfo.student_id);
    const data = await userModel.updateProfile(userObj);
    if (data) {
      return {
        user: data,
        access_token: jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: "12h",
        }),
      };
    }
  }
  return null;
};

exports.changePassword = async (userObj) => {
  const user = await userModel.getUser(userObj.id);
  if (!user) return null;

  const result = await bcrypt.compare(userObj["current-password"], user.password);
  if (!result) return null;

  const salt = await bcrypt.genSalt(10);
  const hashPasword = await bcrypt.hash(userObj["new-password"], salt);
  await userModel.changePassword(userObj.id, hashPasword);
  return true;
};

exports.getAdmins = async (pageSize, page, orderCreatedAt, search) => {
  const admins = await userModel.getAdmins(pageSize, page, orderCreatedAt, search);
  return admins;
};

exports.getUsers = async (pageSize, page, orderCreatedAt, search) => {
  const users = await userModel.getUsers(pageSize, page, orderCreatedAt, search);
  return users;
};

exports.getAdminsCount = async () => {
  const count = await userModel.getAdminsCount();
  return count;
};

exports.getUsersCount = async () => {
  const count = await userModel.getUsersCount();
  return count;
};

exports.getAllUsers = async () => {
  const count = await userModel.getAllUsers();
  return count;
};

exports.createAdmin = async (obj) => {
  const salt = await bcrypt.genSalt(10);
  const hashPasword = await bcrypt.hash(obj.password, salt);
  obj.password = hashPasword;

  if (!obj.role || obj.role === "") obj.role = "Admin";

  const admins = await userModel.createAdmin(obj);
  return admins;
};

exports.updateStatusById = async (object) => {
  const result = await userModel.updateStatusById(object);
  return result;
};

exports.updateStudentCodeById = async (object) => {
  const studentExist = await userModel.checkStudentId(object.student_code);
  if (studentExist){
    return null;
  }
  const curUser = await userModel.getUser(object.id);
  if (curUser.student_id)
  {
    const result1 = await userModel.updateStudentCodeInClassSTC(object.student_code, curUser.student_id);
    const result2 = await userModel.updateStudentCodeInSyllabus(object.student_code, curUser.student_id);
  }
  const result = await userModel.updateStudentCodeById(object);
  return result;
};

exports.getUsers = async (pageSize, page, orderCreatedAt, search) => {
  const admins = await userModel.getUsers(pageSize, page, orderCreatedAt, search);
  return admins;
};

exports.getUsersCount = async () => {
  const count = await userModel.getUsersCount();
  return count;
};
