const syllbusService = require("./syllabusService");

exports.updateSyllabus = async (req, res) => {
  const isSuccess = await syllbusService.updateSyllabus(req.params.id, req.body);
  if (isSuccess) {
    return res.status(200).json(isSuccess);
  }
  return res.status(400).send();
};
