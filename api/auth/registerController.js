const registerService = require("./registerService");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.create = async (req, res) => {
  const isExist = await registerService.getUserByEmail(req.body.email);
  console.log("isExist", isExist);
  if (isExist) {
    res.status(405).json({ message: "This account has already existed" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPasword = await bcrypt.hash(req.body.password, salt);
  if (!isExist) {
    const userObj = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hashPasword,
      email: req.body.email,
    };
    const isSuccess = await registerService.create(userObj);
    if (isSuccess) {
      const userVerified = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
      }
      const token = jwt.sign(userVerified, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "12h",
      });
      const msg = {
        to: req.body.email,
        from: {
          email: "phucyugi@gmail.com",
          name: "Classroom SPA",
        },
        template_id: process.env.TEMPLATE_VERIFIED,
        dynamic_template_data: {
          api_verified: process.env.FRONTEND_HOST + `/verified?token=` + token,
        },
        hideWarnings: true,
      };
      sgMail
        .send(msg)
        .then((response) => {
          res.status(201).json({ message: "User created!" });
        })
        .catch((error) => {
          res.status(405).json({ message: "Error!" });
        });
    } else {
      res.status(405).json({ message: "Error!" });
    }
  }
};
