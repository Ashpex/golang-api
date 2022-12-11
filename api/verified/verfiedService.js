const userModel = require("../user/userModel");
const classModel = require("../classes/classModel");
const jwt = require("jsonwebtoken");

exports.verifiedToken = async (token) => {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    if (!payload) {
        return false;
    }
    const userInfo = await classModel.getUserDataByEmail(payload.email);
    const objUpdateStatus = {
        id: userInfo.id,
        status: 'Active'
    }
    const resultUpdate = await userModel.updateStatusById(objUpdateStatus);
    const userObj = {
        id: userInfo.id,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
        avatar: userInfo.avatar,
        student_id: userInfo.student_id,
        role: userInfo.role,
    }
    const result = {
        user: userObj,
        access_token: jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: "12h",
        })
    }
    return result;
};