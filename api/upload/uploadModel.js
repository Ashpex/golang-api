const pool = require("../../config-db");

module.exports = {
  async uploadClassList(class_id, student_list) {
    let sql = "INSERT INTO class_student_code (class_id, student_code, full_name) VALUES";
    const amount = student_list.length;
    student_list.forEach((student, index) => {
      sql += ` (${class_id},${student.StudentId},'${student.FullName}')`;
      if (index !== amount - 1) sql += ",";
    });
    sql += " ON CONFLICT (class_id, student_code) DO NOTHING RETURNING *";
    let sql2 = `select b.id from (select id from grade_structure where class_id = ${class_id}) as a join (select * from syllabus) as b on a.id = b.grade_structure_id`;
    const [result1, result2] = await Promise.all([pool.query(sql), pool.query(sql2)]);
    console.log("result1", result1);
    console.log("result2", result2);
    if (result2.rows.length > 0) {
      //no grade structure yet
      let sql3 = "INSERT INTO student_syllabus(student_code,syllabus_id) VALUES ";
      let temp = [];
      result1.rows.forEach((student) => {
        let tempScore = ["0"];
        result2.rows.forEach((syllabus) => {
          temp.push(`('${student.student_code}',${syllabus.id})`);
          tempScore.push("0");
        });
        student.avatar = null;
        student.isexist = false;
        student.list_score = tempScore;
      });
      sql3 += temp.join(",");
      console.log("sql3", sql3);
      if (!temp || temp.length === 0) {
        return result1.rows;
      }
      await pool.query(sql3);
    }

    return result1.rows;
  },

  async getStudentGradeList(class_id) {
    try {
      const records = await pool.query(
        `select c.student_code as Student_id, (null) as Grade from class_student_code c where c.class_id = $1`,
        [class_id]
      );
      return records.rows;
    } catch (error) {
      return null;
    }
  },

  uploadGradeList(syllabus_id, grade_list) {
    let sql = "INSERT INTO student_syllabus (syllabus_id, student_code, score) VALUES";
    const amount = grade_list.length;
    grade_list.forEach((student, index) => {
      sql += ` (${syllabus_id},${student.StudentId},'${student.Grade}')`;
      if (index !== amount - 1) sql += ",";
    });
    sql +=
      " ON CONFLICT (syllabus_id, student_code) DO UPDATE SET score = EXCLUDED.score RETURNING *";
    return pool.query(sql);
  },
};
