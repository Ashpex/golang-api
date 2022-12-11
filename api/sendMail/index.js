const express = require("express");
const router = express.Router();
const sendMailController = require('./sendMailController');

router.get("/",sendMailController.joinClassByEmail);

router.get("/invite-student",sendMailController.joinClassByEmailStudent)

router.post("/accept-student",sendMailController.acceptStudent);

router.post("/accept-teacher",sendMailController.acceptTeacher);

module.exports = router;
