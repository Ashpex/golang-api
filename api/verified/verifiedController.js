const jwt = require("jsonwebtoken");
const verifiedService = require("./verfiedService");

exports.verifiedToken = async (req, res) => {
    const isSuccess = await verifiedService.verifiedToken(req.body.token);
    if (isSuccess) {
      res.status(200).json(isSuccess);
    } else {
      res.status(500).json({ message: "not ok" });
    }
  };