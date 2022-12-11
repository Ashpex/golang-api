const pool = require("../../config-db");

exports.updateProfile = async (userObj) => {
  try {
    const records = await pool.query(
      `UPDATE "user" SET first_name=$1,last_name=$2,student_id=$3 WHERE id=$4 RETURNING id,first_name,last_name,email,avatar,student_id`,
      [userObj.first_name, userObj.last_name, userObj.student_id, userObj.id]
    );
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (err) {
    return err;
  }
};

exports.checkStudentId = async (student_id) => {
  try {
    const records = await pool.query(`SELECT * FROM "user" WHERE student_id=$1`, [student_id]);
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (err) {
    return err;
  }
};

exports.getUser = async (id) => {
  try {
    const records = await pool.query(`SELECT * FROM "user" WHERE id=$1`, [id]);
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows[0];
  } catch (err) {
    return err;
  }
};

exports.getAllUsers = async () => {
  try {
    const records = await pool.query(`SELECT * FROM "user"`, []);
    if (records.rowCount === 0) {
      return null;
    }
    return records.rows;
  } catch (err) {
    return err;
  }
};

exports.changePassword = async (id, hashPasword) => {
  await pool.query(`UPDATE "user" SET password=$2 WHERE id=$1`, [id, hashPasword]);
};

exports.getAdmins = async (pageSize, page, orderCreatedAt, search) => {
  // console.log(orderCreatedAt);
  let tempSearch = null;
  if (search !== "") {
    tempSearch = `AND (first_name LIKE '%${search}%' OR last_name LIKE '%${search}%' OR email LIKE '%${search}%') `;
    console.log(tempSearch);
  }
  // console.log(search + "-" + tempSearch);
  let sql =
    `SELECT id,first_name,last_name,email,avatar,role,status,"createdAt" FROM "user" WHERE role NOTNULL ` +
    (tempSearch !== null ? tempSearch : "") +
    ` ORDER BY "createdAt" ` +
    orderCreatedAt +
    ` LIMIT $1 OFFSET $2`;
  console.log(sql);
  console.log([pageSize, (page - 1) * pageSize]);
  const result = await pool.query(sql, [pageSize, (page - 1) * pageSize]);
  console.log(result);
  return result.rows;
};

exports.getUsers = async (pageSize, page, orderCreatedAt, search) => {
  let tempSearch = null;
  if (search !== "") {
    tempSearch = `AND (first_name LIKE '%${search}%' OR last_name LIKE '%${search}%' OR email LIKE '%${search}%') `;
  }
  let sql =
    `SELECT id,first_name,last_name,email,avatar,role,status,"createdAt", student_id as student_code FROM "user" WHERE role IS NULL ` +
    (tempSearch !== null ? tempSearch : "") +
    ` ORDER BY "createdAt" ` +
    orderCreatedAt +
    ` LIMIT $1 OFFSET $2`;
  const result = await pool.query(sql, [pageSize, (page - 1) * pageSize]);
  return result.rows;
};

exports.getAdminsCount = async () => {
  const result = await pool.query(`SELECT COUNT(id) AS count FROM "user" WHERE role NOTNULL`);
  return result.rows[0].count;
};

exports.getUsersCount = async () => {
  const result = await pool.query(`SELECT COUNT(id) AS count FROM "user" WHERE role IS NULL`);
  return result.rows[0].count;
};

exports.createAdmin = async (obj) => {
  const isExist = await pool.query('SELECT id FROM "user" WHERE email=$1', [obj.email]);
  if (isExist.rowCount > 0) return null;
  const result = await pool.query(
    `INSERT INTO "user" (first_name,last_name,email,password,role) VALUES($1,$2,$3,$4,$5)`,
    [obj.first_name, obj.last_name, obj.email, obj.password, obj.role]
  );
  return result;
};

exports.updateStatusById = async (object) => {
  console.log(object);
  const result = await pool.query(`UPDATE "user" SET status = $2 WHERE id = $1`, [
    object.id,
    object.status,
  ]);
  return result;
};

exports.updateStudentCodeById = async (object) => {
  const result = await pool.query(`UPDATE "user" SET student_id = $2 WHERE id = $1`, [
    object.id,
    object.student_code,
  ]);
  return result;
};

exports.updateStudentCodeInClassSTC = async (new_code, old_code) => {
  const result = await pool.query(
    `UPDATE class_student_code SET student_code = $1 WHERE student_code = $2`,
    [new_code, old_code]
  );
  return result;
};

exports.updateStudentCodeInSyllabus = async (new_code, old_code) => {
  const result = await pool.query(
    `UPDATE student_syllabus SET student_code = $1 WHERE student_code = $2`,
    [new_code, old_code]
  );
  return result;
};

exports.checkStudentIdInClassSTC = async (student_code) => {
  try {
    const records = await pool.query(`SELECT * FROM class_student_code WHERE student_code=$1`, [
      student_code,
    ]);
    return records.rowCount;
  } catch (err) {
    return err;
  }
};

exports.checkStudentIdInSyllabus = async (student_code) => {
  try {
    const records = await pool.query(`SELECT * FROM student_syllabus WHERE student_code=$1`, [
      student_code,
    ]);
    return records.rowCount;
  } catch (err) {
    return err;
  }
};
// exports.getUsers = async (pageSize, page, orderCreatedAt, search) => {
//   let tempSearch = null;
//   if (search !== "") {
//     tempSearch = `AND (first_name LIKE '%${search}%' OR last_name LIKE '%${search}%' OR email LIKE '%${search}%') `;
//   }
//   let sql =
//     `SELECT id,first_name,last_name,email,avatar,student_id,status,"createdAt" FROM "user" WHERE role is NULL ` +
//     (tempSearch !== null ? tempSearch : "") +
//     ` ORDER BY "createdAt" ` +
//     orderCreatedAt +
//     ` LIMIT $1 OFFSET $2`;
//   const result = await pool.query(sql, [pageSize, (page - 1) * pageSize]);
//   return result.rows;
// };

exports.getUsersCount = async () => {
  const result = await pool.query(`SELECT COUNT(id) AS count FROM "user" WHERE role is NULL`);
  return result.rows[0].count;
};
