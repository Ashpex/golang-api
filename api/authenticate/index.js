const express = require("express");
const router = express.Router();
const passport = require("../../modules/passport");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const authModel = require("./authModel");
const authController = require("./authController");

router.post(
  "/",
  passport.authenticate("normal_login", { session: false }),
  function (req, res) {
    res.json({
      user: req.user,
      access_token: jwt.sign(req.user, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "12h",
      }),
    });
  }
);

router.post("/google", async function (req, res) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = {
      id_provider: payload["sub"],
      first_name: payload["given_name"],
      last_name: payload["family_name"],
      avatar: payload["picture"],
      email: payload["email"],
    };
    const isExist = await authModel.checkExistUserGoogle(payload["email"]);
    let isSuccess = {};
    if (isExist && isExist.provider_id_gg === null) {
      //exist with other authentication
      isSuccess = await authModel.updateUserGoogle(user, isExist);
    } else if (!isExist) {
      //not exist
      console.log("add thirdparty user");
      isSuccess = await authModel.createUserGoogle(user);
    }
    user["id"] = isExist?.id || isSuccess?.id;
    user["first_name"] = isExist?.first_name || isSuccess?.first_name;
    user["last_name"] = isExist?.last_name || isSuccess?.last_name;
    user["avatar"] = isExist?.avatar || isSuccess?.avatar;
    user["student_id"] = isExist?.student_id || isSuccess?.student_id;
    res.json({
      user: user,
      access_token: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "12h",
      }),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/forgot-password", authController.forgotPassword);

module.exports = router;
