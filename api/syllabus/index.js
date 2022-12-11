const express = require("express");
const router = express.Router();
const syllabusController = require("./syllabusController");

router.put("/:id", syllabusController.updateSyllabus);

module.exports = router;
