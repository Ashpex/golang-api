const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "peaky.blinders.2404@gmail.com",
    pass: "zmrrnszhumfayuyv",
  },
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./views/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views/"),
};

transporter.use("compile", hbs(handlebarOptions));

exports.sendEmail = async (email, content) => {
  const mailOptions = {
    from: "peaky.blinders.2404@gmail.com",
    to: email,
    subject: content.subjectMail,
    template: "email",
    context: {
      title: content.titleContentMail,
      email: email || "",
      groupName: content.groupName || "",
      url: content.url || "",
      isGroupJoined: content.isGroupJoined || false,
      isEmailVerified: content.isEmailVerified || false,
    },
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
