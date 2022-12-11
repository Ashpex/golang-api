const pool = require("../../config-db");

exports.checkExistUserByEmail = async (email) => {
  try {
    const records = await pool.query(
      'SELECT id, password FROM "user" WHERE email=$1',
      [email]
    );
    if (records.rows.length !== 0) return records.rows[0];
    return null;
  } catch (error) {
    return error;
  }
};

exports.udpateUserPassword = async (email, password) => {
  try {
    const records = await pool.query(
      'UPDATE "user" SET password=$2 WHERE email=$1 RETURNING id',
      [email, password]
    );
    if (records.rows.length !== 0) return records.rows[0];
    return null;
  } catch (error) {
    return error;
  }
};

exports.create = async (userObj) => {
  try {
    const records = await pool.query(
      'insert into "user" (first_name,last_name,password,email, status) values($1,$2,$3,$4,$5)',
      [userObj.first_name, userObj.last_name, userObj.password, userObj.email, 'Locked']
    );
    return records;
  } catch (err) {
    return err;
  }
};
