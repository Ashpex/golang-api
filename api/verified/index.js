const express = require("express");
const router = express.Router();
const verifiedController = require("./verifiedController");

router.post("/", verifiedController.verifiedToken);

module.exports = router;