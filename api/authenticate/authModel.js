const pool = require("../../config-db");

exports.checkExistUser = async (userId) => {
  try {
    const records = await pool.query('SELECT id FROM "user" WHERE id=$1', [userId]);
    return records.rows.length;
  } catch (error) {
    return error;
  }
};

exports.checkExistUserByEmail = async (email) => {
  try {
    const records = await pool.query('SELECT id FROM "user" WHERE email=$1', [email]);
    if (records.rows.length !== 0) return records.rows[0];
    return null;
  } catch (error) {
    return error;
  }
};

exports.checkExistUserGoogle = async (email) => {
  try {
    const records = await pool.query('SELECT * FROM "user" WHERE email=$1', [email]);
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (error) {
    return error;
  }
};

exports.updateUserGoogle = async (userObj, lastUserObj) => {
  try {
    let sql = `update "user" set ${
      !lastUserObj.first_name ? "first_name='" + userObj.first_name + "'," : ""
    }${!lastUserObj.last_name ? "last_name='" + userObj.last_name + "'," : ""}${
      !lastUserObj.avatar ? "avatar='" + userObj.avatar + "'," : ""
    }${
      !lastUserObj.provider_id_gg ? "provider_id_gg='" + userObj.id_provider + "'" : ""
    } where email='${userObj.email}' returning *`;
    const records = await pool.query(sql);
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (err) {
    return err;
  }
};

exports.createUserGoogle = async (userObj) => {
  try {
    const records = await pool.query(
      'insert into "user" (first_name,last_name,email,avatar,provider_id_gg) values($1,$2,$3,$4,$5) returning *',
      [userObj.first_name, userObj.last_name, userObj.email, userObj.avatar, userObj.id_provider]
    );
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (err) {
    return err;
  }
};

exports.checkExistUserFacebook = async (email) => {
  try {
    const records = await pool.query('SELECT * FROM "user" WHERE email=$1', [email]);
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (error) {
    return error;
  }
};

exports.updateUserFacebook = async (userObj, lastUserObj) => {
  try {
    const sql = `update "user" set ${
      !lastUserObj.first_name ? "first_name='" + userObj.first_name + "'," : ""
    }${!lastUserObj.last_name ? "last_name='" + userObj.last_name + "'," : ""}${
      !lastUserObj.avatar ? "avatar='" + userObj.avatar + "'," : ""
    }${
      !lastUserObj.provider_id_fb ? "provider_id_fb='" + userObj.id_provider + "'" : ""
    } where email='${userObj.email}' returning *`;
    const records = await pool.query(sql);
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.createUserFacebook = async (userObj) => {
  try {
    const records = await pool.query(
      'insert into "user" (first_name,last_name,email,avatar,provider_id_fb) values($1,$2,$3,$4,$5) returning *',
      [userObj.first_name, userObj.last_name, userObj.email, userObj.avatar, userObj.id_provider]
    );
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (err) {
    return err;
  }
};
