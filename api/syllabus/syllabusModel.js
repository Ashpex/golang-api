const pool = require("../../config-db");

async function updateSyllabus1(id, body) {
  try {
    const records = await pool.query("UPDATE syllabus SET finalize=$1 WHERE id=$2 RETURNING *", [
      body.finalize,
      id,
    ]);
    if (records.rowCount > 0) {
      return records.rows[0];
    }
  } catch (err) {
    return err;
  }
}

module.exports = {
  updateSyllabus1,
};
