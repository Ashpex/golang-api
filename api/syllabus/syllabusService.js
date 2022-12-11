const syllabusModel = require("./syllabusModel");

async function updateSyllabus(id, body) {
  const isSuccess = await syllabusModel.updateSyllabus1(id, body);
  return isSuccess;
}

module.exports = {
  updateSyllabus,
};
