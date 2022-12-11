const express = require("express");
const router = express.Router();
const passport = require("../../modules/passport");
const jwt = require("jsonwebtoken");
const pool = require("../../config-db");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE);
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
      audience: process.env.CLIENT_ID_GOOGLE,
    });
    const payload = ticket.getPayload();
    const user = {
      id_provider: payload["sub"],
      first_name: payload["given_name"],
      last_name: payload["family_name"],
      avatar: payload["picture"],
      email: payload["email"],
    };
    // const isExist = await authModel.checkExistUserThirdParty(payload["sub"]);
    // if (!isExist) {
    //   const isSucess = await authModel.createThirdPartyUser(user);
    // }
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

router.post("/facebook", async function (req, res, next) {
  await passport.authenticate(
    "facebook-token",
    async function (err, user, info) {
      if (err) res.status(401);
      if (user) {
        const currentUser = {
          id_provider: user.id,
          first_name: user.name.givenName,
          last_name: user.name.familyName,
          avatar: user._json.picture.data.url,
          email: user.emails[0].value,
        };
        // const isExist = await authModel.checkExistUserThirdParty(
        //   currentUser.id_provider
        // );
        // if (!isExist) {
        //   const isSucess = await authModel.createThirdPartyUser(currentUser);
        // }
        const isExist = await authModel.checkExistUserFacebook(
          currentUser.email
        );
        let isSuccess = {};
        if (isExist && isExist.provider_id_fb === null) {
          //exist with other authentication
          isSuccess = await authModel.updateUserFacebook(currentUser, isExist);
        } else if (!isExist) {
          //not exist
          isSuccess = await authModel.createUserFacebook(currentUser);
        }
        currentUser["id"] = isExist?.id || isSuccess?.id;
        currentUser["first_name"] =
          isExist?.first_name || isSuccess?.first_name;
        currentUser["last_name"] = isExist?.last_name || isSuccess?.last_name;
        currentUser["avatar"] = isExist?.avatar || isSuccess?.avatar;
        currentUser["student_id"] =
          isExist?.student_id || isSuccess?.student_id;
        res.status(200).json({
          user: currentUser,
          access_token: jwt.sign(
            currentUser,
            process.env.ACCESS_TOKEN_SECRET_KEY,
            {
              expiresIn: "12h",
            }
          ),
        });
      } else {
        res.status(401);
      }
    }
  )(req, res, next);
});

router.post("/forgot-password", authController.forgotPassword);

module.exports = router;
