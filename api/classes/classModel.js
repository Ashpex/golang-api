const pool = require("../../config-db");

exports.list = async () => {
  try {
    const records = await pool.query("SELECT * FROM classroom");
    return records.rows;
  } catch (err) {
    return err;
  }
};

exports.listClassByUserId = async (userId) => {
  try {
    const records = await pool.query(
      "select * from classroom c inner join (select a.class_id as student,b.class_id as teacher from (select class_id from class_student where student_id = $1) a full join (select class_id from class_teacher where teacher_id = $1 ) b on a.class_id=b.class_id) d on c.id=d.teacher or c.id=d.student ",
      [userId]
    );
    if (records.rowCount >= 0) return records.rows;
    return null;
  } catch (err) {
    return err;
  }
};

exports.getListStudentByClassId = async (class_id) => {
  try {
    const records = await pool.query(
      `select u.id,u.first_name ,u.last_name from class_student cs join "user" u on cs.student_id = u.id where cs.class_id = $1`,
      [class_id]
    );
    return records.rows;
  } catch (err) {
    return err;
  }
};

exports.createClass = async (classObj) => {
  try {
    const records = await pool.query(
      "insert into classroom(name,section,topic,description,invitecode,created_date) values($1,$2,$3,$4,$5,$6) returning *",
      [classObj.name, classObj.section, classObj.topic, classObj.description, classObj.invitecode, new Date()]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.createTeacherForClass = async (teacher_id, class_id) => {
  try {
    const records = await pool.query(
      "insert into class_teacher(class_id, teacher_id) values($1,$2) returning id",
      [class_id, teacher_id]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getDetailClass = async (id) => {
  try {
    const records = await pool.query("select * from classroom c where c.id=$1", [Number(id)]);
    return records.rows[0];
  } catch (err) {
    return err;
  }
};

exports.joinClass = async (class_id, student_id) => {
  try {
    const records = await pool.query(
      `insert into class_student(class_id, student_id) values($1,$2) returning id`,
      [class_id, student_id]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.joinClassByTeacherRole = async (class_id, student_id) => {
  try {
    const records = await pool.query(
      "insert into class_teacher(class_id, teacher_id) values($1,$2) returning id",
      [class_id, student_id]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.checkExistStudentInClass = async (class_id, student_id) => {
  try {
    const records = await pool.query(
      "select * from class_student where class_id = $1 and student_id = $2",
      [class_id, student_id]
    );
    console.log(records.rowCount);
    return records.rowCount;
  } catch (error) {
    return null;
  }
};

exports.checkExistTeacherInClass = async (class_id, student_id) => {
  try {
    const records = await pool.query(
      "select * from class_teacher where class_id = $1 and teacher_id = $2",
      [class_id, student_id]
    );
    console.log(records.rowCount);
    return records.rowCount;
  } catch (error) {
    return null;
  }
};

exports.getUserDataByEmail = async (email) => {
  try {
    const records = await pool.query('select * from "user" u where u.email = $1', [email]);
    return records.rows[0];
  } catch (error) {
    return null;
  }
};

exports.getClassDataByInviteCode = async (invite_code) => {
  try {
    const records = await pool.query("select * from classroom c where c.invitecode = $1", [
      invite_code,
    ]);
    return records.rows[0];
  } catch (error) {
    return null;
  }
};

exports.getClassDataById = async (class_id) => {
  try {
    const records = await pool.query("select * from classroom c where c.id = $1", [class_id]);
    return records.rows[0];
  } catch (error) {
    return null;
  }
};

exports.getDataStudentsByClassId = async (class_id) => {
  try {
    const records = await pool.query(
      'select u.id, u.first_name, u.last_name, u.avatar,u.student_id from class_student cs join "user" u on cs.student_id = u.id where class_id = $1',
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
};

exports.getDataTeachersByClassId = async (class_id) => {
  try {
    const records = await pool.query(
      'select u.id, u.first_name, u.last_name, u.avatar from class_teacher cs join "user" u on cs.teacher_id = u.id where class_id = $1',
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
};

exports.removeStudentInClass = async (class_id, student_id) => {
  try {
    const records = await pool.query(
      `delete from class_student cs where cs.class_id = $1 and cs.student_id = $2`,
      [class_id, student_id]
    );
    return records;
  } catch (error) {
    return error;
  }
};

exports.addQueueUser = async (email, role, class_id) => {
  try {
    const records = await pool.query(
      `insert into invite_queue(email,role,class_id) values($1,$2,$3)`,
      [email, role, class_id]
    );
    return records;
  } catch (error) {
    return error;
  }
};

exports.removeQueueUser = async (email, role, class_id) => {
  try {
    const records = await pool.query(
      `delete from invite_queue where email = $1 and role = $2 and class_id = $3`,
      [email, role, class_id]
    );
    return records;
  } catch (error) {
    return error;
  }
};

exports.checkQueueUser = async (email, class_id, role) => {
  try {
    const records = await pool.query(
      `select * from invite_queue where email = $1 and class_id = $2 and role = $3`,
      [email, class_id, role]
    );
    return records.rowCount;
  } catch (error) {
    return null;
  }
};

exports.listAssignment = async (user, classId) => {
  try {
    const record = await pool.query(
      'SELECT * FROM assignment WHERE class_id=$1 ORDER BY "order" ASC',
      [classId]
    );
    return [record.rowCount, record.rows];
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.deleteAssignment = async (user, body) => {
  try {
    const record = await pool.query(
      "DELETE FROM assignment WHERE id=$1 AND class_id=$2 AND teacher_id=$3 RETURNING *",
      [body.assignmentId, body.classId, user.id]
    );
    return [record.rowCount, record.rows];
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.addAssignment = async (user, body) => {
  try {
    const record = await pool.query(
      "SELECT 1 FROM class_teacher WHERE class_id=$1 AND teacher_id=$2",
      [body.classId, user.id]
    );
    if (record.rowCount !== 0) {
      const record2 = await pool.query(
        `INSERT INTO assignment(class_id,teacher_id,title,description,point,"order") VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
        [body.classId, user.id, body.title, body.description, body.point, body.count + 1]
      );
      if (record2.rowCount !== 0) return record2.rows[0];
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.updateAssignment = async (user, body) => {
  try {
    const record = await pool.query(
      "SELECT 1 FROM class_teacher WHERE class_id=$1 AND teacher_id=$2",
      [body.classId, user.id]
    );
    if (record.rowCount !== 0) {
      const record2 = await pool.query(
        "UPDATE assignment SET title=$1,description=$2,point=$3 WHERE id=$4 RETURNING *",
        [body.title, body.description, body.point, body.assignmentId]
      );
      if (record2.rowCount !== 0) return record2.rows[0];
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.updateAssignmentOrder = async (user, body) => {
  try {
    const record = await pool.query(
      "SELECT 1 FROM class_teacher WHERE class_id=$1 AND teacher_id=$2",
      [body.classId, user.id]
    );
    if (record.rowCount !== 0) {
      let sql = `UPDATE assignment SET "order" = CASE id `;
      body.newOrder.forEach((element) => {
        sql += `WHEN ${element.id} THEN ${element.order} `;
      });
      sql += `ELSE 0 END WHERE id IN (${body.newOrder.map((item) => item.id)}) RETURNING *`;
      console.log(sql);
      const record2 = await pool.query(sql);
      if (record2.rowCount !== 0) return record2.rows[0];
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

exports.getGradeStructure = async (class_id) => {
  try {
    const records = await pool.query(
      "select * from grade_structure where class_id = $1",
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.getSyllabus = async (grade_structure_id) => {
  try {
    const records = await pool.query(
      `select * from syllabus s where grade_structure_id = $1 order by s."order" ASC`,
      [grade_structure_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.removeGradeStructure = async (class_id) => {
  try {
    const records = await pool.query(
      `delete from grade_structure gs where gs.class_id = $1`,
      [class_id]
    );
    return records;
  } catch (error) {
    return error;
  }
};

exports.removeSyllabus = async (grade_structure_id) => {
  try {
    const records = await pool.query(
      `delete from syllabus s where s.grade_structure_id = $1`,
      [grade_structure_id]
    );
    return records;
  } catch (error) {
    return error;
  }
};

exports.addGradeStructure = async (object) => {
  try {
    const records = await pool.query(
      "insert into grade_structure(class_id,topic,description) values($1,$2,$3) returning *",
      [object.class_id, object.topic, object.description]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.addSyllabus = async (object) => {
  try {
    const records = await pool.query(
      `insert into syllabus(id,grade_structure_id,subject_name,grade,"order",finalize) values($1,$2,$3,$4,$5,$6) returning *`,
      [object.id, object.grade_structure_id, object.subject_name, object.grade, object.order, object.finalize]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.addSyllabusCheck = async (object) => {
  try {
    const records = await pool.query(
      `insert into syllabus(grade_structure_id,subject_name,grade,"order",finalize) values($1,$2,$3,$4,false) returning *`,
      [object.grade_structure_id, object.subject_name, object.grade, object.order]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.getGradeTable = async (class_id, grade_structure_id) => {
  try {
    const records = await pool.query(
      `select s1.*, s.grade as max_score, s."order" from 
      syllabus s
      join (select ss.*,s2.student_id as exist_code 
      from student_syllabus ss left join 
      (select u.student_id 
      from "user" u 
      join class_student cs on u.id = cs.student_id 
      where cs.class_id = $1) as s2 on s2.student_id = ss.student_code) as s1
      on s.id = s1.syllabus_id
      where s.grade_structure_id = $2
      order by s."order" ASC`,
      [class_id, grade_structure_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.getAllStudentGradeStructure = async (class_id) => {
  try {
    const records = await pool.query(
      `select distinct (ss.student_code)
      from class_student_code ss
      where ss.class_id = $1`,
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.getListScoreOfStudent = async (grade_structure_id, student_code, order) => {
  try {
    const records = await pool.query(
      `select ss.score 
      from student_syllabus ss join syllabus s on ss.syllabus_id  = s.id
      where s.grade_structure_id = $1 and ss.student_code = $2 and s."order" = $3
      order by s."order" asc`,
      [grade_structure_id, student_code, order]
    );
    return records.rows[0];
  } catch (error) {
    return null;
  }
}

exports.checkExistStudentCode = async (student_code) => {
  try {
    const records = await pool.query(
      `select *
      from "user" u 
      where u.student_id = $1`,
      [student_code]
    );
    if (records.rows.length) {
      return records.rows[0];
    }
    return false;
  } catch (error) {
    return null;
  }
}

exports.getInfoStudentGradeStructure = async (student_code) => {
  try {
    const records = await pool.query(
      `select *
      from class_student_code csc 
      where csc.student_code = $1`,
      [student_code]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.countSyllabus = async (grade_structure_id) => {
  try {
    const records = await pool.query(
      `select count(*) as sl
      from syllabus s 
      where s.grade_structure_id = $1`,
      [grade_structure_id]
    );
    return records.rows[0];
  } catch (error) {
    return null;
  }
}

exports.updateScoreStudentSyllabus = async (score, student_code, syllabus_id) => {
  try {
    const records = await pool.query(
      `UPDATE student_syllabus set score=$1 where student_code=$2 and syllabus_id=$3`,
      [score, student_code, syllabus_id]
    );
    return true;
  } catch (error) {
    return null;
  }
}

exports.checkExistSyllabus = async (id) => {
  try {
    const records = await pool.query(
      `select count(*) as sl
      from syllabus s 
      where s.id = $1`,
      [id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.getGradePersonal = async (class_id, user_id) => {
  try {
    const records = await pool.query(
      `select temp3.*, temp4.expect_score, temp4.reason, temp4.id as review_id from (select temp2.*
        from "user" u join (
        select temp1.*, ss.score as grade, ss.student_code from student_syllabus ss join 
        (select s.id as syllabus_id , s.subject_name as syllabus_name, s.order, s.grade as maxGrade 
        from grade_structure gs join syllabus s on gs.id = s.grade_structure_id
        where class_id = $1 and s.finalize = true 
        order by s.order asc) as temp1 on ss.syllabus_id = temp1.syllabus_id
        ) as temp2 on temp2.student_code = u.student_id
        where u.id = $2) as temp3 left join (select rs2.*,u2.student_id as student_code from review_student rs2 join "user" u2 on rs2.student_id = u2.id) as temp4 on (temp3.syllabus_id = temp4.syllabus_id and temp3.student_code = temp4.student_code)
        order by temp3.order asc`,
      [class_id, user_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.getAllGradeReviewByClassId = async (class_id) => {
  try {
    const records = await pool.query(
      `select temp1.*, u.student_id as student_code from "user" u join (
        select rs.id, rs.student_id,rs.syllabus_id, temp1.subject_name as syllabus_name, rs.expect_score as grade,temp1.grade as maxGrade, rs.final_score, rs.final_mark, rs.reason , rs.created_at, rs.real_score from review_student rs join 
              (select s.* from grade_structure gs join syllabus s on gs.id = s.grade_structure_id where gs.class_id = $1) as temp1
              on rs.syllabus_id = temp1.id
              order by created_at asc) as temp1 on u.id = temp1.student_id `,
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.addReview = async (object) => {
  try {
    const records = await pool.query(
      `insert into review_student(syllabus_id, student_id, reason, expect_score, final_mark, created_at, real_score) values ($1,$2,$3,$4,false,$5,$6) returning *`,
      [object.syllabus_id, object.student_id, object.reason, object.expect_score, new Date(), object.real_score]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.querySelect = async (query) => {
  try {
    const records = await pool.query(`` + query, []);
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.addComment = async (object) => {
  try {
    const records = await pool.query(
      `insert into comment(review_id, comment, user_id, name_user, created_at, avatar, status, is_student) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *`,
      [object.review_id, object.comment, object.user_id, object.name_user, new Date(), object.avatar, true, object.is_student]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.getCommentByReviewId = async (review_id) => {
  try {
    const records = await pool.query(
      `select * from comment where review_id = $1 order by created_at asc`,
      [review_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.updateStatusComment = async (review_id) => {
  try {
    const records = await pool.query(
      `UPDATE comment set status = false where review_id = $1 returning *`,
      [review_id]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.updateReview = async (object) => {
  try {
    const records = await pool.query(
      `UPDATE review_student set final_score = $1, final_mark = true where student_id=$2 and syllabus_id=$3`,
      [object.final_score, object.student_id, object.syllabus_id]
    );
    return true;
  } catch (error) {
    return null;
  }
}

exports.getListClassSubcribeSocket = async (user_id) => {
  try {
    const records = await pool.query(
      `select ct.class_id, ('teacher') as role_name from "user" u join class_teacher ct on u.id = ct.teacher_id where u.id = $1
      union 
      select cs.class_id, ('student') as role_name from "user" u2 join class_student cs on u2.id = cs.student_id where u2.id = $1`,
      [user_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.addNotificationPublic = async (object) => {
  try {
    const records = await pool.query(
      `insert into notification(sender_name, message, has_read, link_navigate, time, sender_avatar, class_id, to_role_name, uuid) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
      [object.sender_name, object.message, object.has_read, object.link_navigate, new Date(), object.sender_avatar, object.class_id, object.to_role_name, object.uuid]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.addNotificationPrivate = async (object) => {
  try {
    const records = await pool.query(
      `insert into notification(sender_name, message, has_read, link_navigate, time, sender_avatar, class_id, to_user, uuid) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
      [object.sender_name, object.message, object.has_read, object.link_navigate, new Date(), object.sender_avatar, object.class_id, object.to_user, object.uuid]
    );
    if (records.rowCount !== 0) return records.rows[0];
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.getAllNotification = async (user_id) => {
  try {
    const records = await pool.query(
      `select n.* from
      (select ct.class_id, ('teacher') as role_name from "user" u join class_teacher ct on u.id = ct.teacher_id where u.id = $1
      union 
      select cs.class_id, ('student') as role_name from "user" u2 join class_student cs on u2.id = cs.student_id where u2.id = $1) 
      as temp1 join notification n on ((n.to_role_name = temp1.role_name and n.class_id = temp1.class_id) or (n.to_user = $1 and n.class_id = temp1.class_id))
      order by time desc`,
      [user_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.updateStatusNotification = async (object) => {
  try {
    const records = await pool.query(
      `UPDATE notification set has_read = $1 where uuid = $2`,
      [object.has_read, object.uuid]
    );
    return true;
  } catch (error) {
    return null;
  }
}

exports.getInfoUserById = async (user_id) => {
  try {
    const records = await pool.query(
      `select * from "user" u where u.id = $1`,
      [user_id]
    );
    return records.rows[0];
  } catch (error) {
    return null;
  }
}

exports.getAllClassroom = async (pageSize, page, orderCreatedAt, search) => {
  try {
    let tempSearch = null;
    if (search !== "") {
      tempSearch = `WHERE (c.name LIKE '%${search}%' OR c.section LIKE '%${search}%' OR c.topic LIKE '%${search}%') `;
    }
    let sql =
    `select * from classroom c ` +
    (tempSearch !== null ? tempSearch : "") +
    ` ORDER BY "created_date" ` +
    orderCreatedAt +
    ` LIMIT $1 OFFSET $2`;
    console.log(sql);
    const result = await pool.query(sql, [pageSize, (page - 1) * pageSize]);
    return result.rows;
  } catch (error) {
    return null;
  }
}

exports.getSyllabusByClassId = async (class_id) => {
  try {
    const records = await pool.query(
      `select s.id, s.grade_structure_id, s.subject_name as "name", s.grade as "max",s."order" 
      from grade_structure gs join syllabus s on gs.id = s.grade_structure_id 
      where class_id = $1 order by s."order" asc `,
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
}

exports.getListStudentByClassIdV2 = async (class_id) => {
  try {
    const records = await pool.query(
      `select concat(u.first_name, ' ',u.last_name) as "name", u.avatar from "user" u join class_student cs on u.id = cs.student_id where cs.class_id = $1`,
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
};

exports.getListTeacherByClassIdV2 = async (class_id) => {
  try {
    const records = await pool.query(
      `select concat(u.first_name, ' ',u.last_name) as "name", u.avatar from "user" u join class_teacher cs on u.id = cs.teacher_id where cs.class_id = $1`,
      [class_id]
    );
    return records.rows;
  } catch (error) {
    return null;
  }
};

exports.getClassesCount = async () => {
  const result = await pool.query(`SELECT COUNT(id) AS count FROM classroom`);
  return result.rows[0].count;
};

exports.checkExistStudentInClassById = async (student_id) => {
  try {
    const records = await pool.query(
      "select * from class_student where student_id = $1",
      [student_id]
    );
    return records.rowCount;
  } catch (error) {
    return null;
  }
};

exports.checkExistTeacherInClassById = async (student_id) => {
  try {
    const records = await pool.query(
      "select * from class_teacher where teacher_id = $1",
      [student_id]
    );
    return records.rowCount;
  } catch (error) {
    return null;
  }
};