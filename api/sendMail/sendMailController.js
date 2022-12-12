const sendMailService = require("./sendMailService");

exports.joinClassByEmail = async (req, res) => {
  const link =
    (process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_HOST_PROD
      : process.env.FRONTEND_HOST) +
    "/invite/" +
    req.query.class_id +
    "?role=TEACHER";
  res.redirect(link);
};

exports.joinClassByEmailStudent = async (req, res) => {
  const link =
    (process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_HOST_PROD
      : process.env.FRONTEND_HOST) +
    "/invite/" +
    req.query.class_id +
    "?role=STUDENT";
  res.redirect(link);
};

exports.acceptTeacher = async (req, res) => {
  const data = await sendMailService.joinClass(
    req.body.email,
    req.body.class_id
  );
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.acceptStudent = async (req, res) => {
  const data = await sendMailService.joinClassByStudentRole(
    req.body.email,
    req.body.class_id
  );
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};
