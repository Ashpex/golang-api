const authService = require("./authService");

function forgotPassword(req, res) {
  try {
    authService.forgotPassword(req.body.email);
    res.send();
  } catch (err) {
    res.status(500).send();
  }
}

module.exports = { forgotPassword };
