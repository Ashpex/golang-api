const classModel = require("./classModel");
const axios = require("axios");
const sendMail = require("@sendgrid/mail");
const { response } = require("../../app");

exports.list = async () => {
  const data = await classModel.list();
  return data;
};

exports.listClassByUserId = async (userId) => {
  const data = await classModel.listClassByUserId(userId);
  return data;
};

exports.create = async (teacher_id, classObj) => {
  classObj["invitecode"] = Math.random().toString(36).substring(2, 8);
  const data = await classModel.createClass(classObj);
  if (data) {
    const result = await classModel.createTeacherForClass(teacher_id, data.id);
    if (result) return data;
  }
  return null;
};

const send_single_mail = async (
  sender_teacher_email,
  invite_code,
  call_back_api,
  template,
  role
) => {
  const senderDataUser = await classModel.getUserDataByEmail(sender_teacher_email);
  let nameUser = "";
  if (!senderDataUser) {
  } else {
    nameUser = senderDataUser.first_name + " " + senderDataUser.last_name;
  }
  const classData = await classModel.getClassDataByInviteCode(invite_code);
  if (!classData) {
    return null;
  }
  if (role == "TEACHER" && senderDataUser) {
    const checkExistTeacher = await classModel.checkExistTeacherInClass(
      classData.id,
      senderDataUser
    );
    if (checkExistTeacher) return null;
  }
  if (role == "STUDENT" && senderDataUser) {
    const checkExistStudent = await classModel.checkExistStudentInClass(
      classData.id,
      senderDataUser
    );
    if (checkExistStudent) return null;
  }
  const isExist = await classModel.checkQueueUser(sender_teacher_email, classData.id, role);
  if (!isExist) {
    const result = await classModel.addQueueUser(sender_teacher_email, role, classData.id);
  }
  sendMail.setApiKey(process.env.KEY_API_EMAIL);
  const msg = {
    to: {
      email: sender_teacher_email,
    },
    from: {
      email: "phucyugi@gmail.com",
      name: "The HCMUS team",
    },
    template_id: template,
    dynamic_template_data: {
      invite_teacher: nameUser,
      api_join_class: call_back_api + `email=` + sender_teacher_email + `&class_id=` + classData.id,
      class_name: classData.name,
    },
    hideWarnings: true,
  };
  return sendMail
    .send(msg)
    .then((response) => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

exports.inviteByMail = async (list_email, invite_code) => {
  const error_list = [];
  for (const item of list_email) {
    const isSucess = await send_single_mail(
      item.email,
      invite_code,
      process.env.NODE_ENV === "production"
        ? process.env.CALL_BACK_SEND_MAIL_API_PROD
        : process.env.CALL_BACK_SEND_MAIL_API,
      process.env.TEMPLATE_ID,
      "TEACHER"
    );
    if (!isSucess) {
      error_list.push(item);
    }
  }
  return error_list;
};

exports.inviteByMailToStudent = async (list_email, invite_code) => {
  const error_list = [];
  for (const item of list_email) {
    console.log(item.email);
    const isSucess = await send_single_mail(
      item.email,
      invite_code,
      process.env.NODE_ENV === "production"
        ? process.env.CALL_BACK_API_STUDENT_PROD
        : process.env.CALL_BACK_API_STUDENT,
      process.env.TEMPLATE_ID_STUDENT,
      "STUDENT"
    );
    if (!isSucess) {
      error_list.push(item);
    }
  }
  return error_list;
};

//process.env.CALL_BACK_SEND_MAIL_API + `email=` + senderEmail + `&invite_code=` + invite_code

exports.getDetailClass = async (id, user_id) => {
  const data = await classModel.getDetailClass(id);
  data["studentList"] = await classModel.getDataStudentsByClassId(id);
  data["teacherList"] = await classModel.getDataTeachersByClassId(id);
  if (data.studentList.find((s) => s.id == user_id)) {
    data["isTeacher"] = false;
  } else if (data.teacherList.find((t) => t.id == user_id)) {
    data["isTeacher"] = true;
  } else {
    return null;
  }
  // const isExist = await classModel.checkExistTeacherInClass(id,user_id);
  // if (isExist)
  // {
  //   data["isTeacher"] = true;
  // }else{
  //   data["isTeacher"] = false;
  // }
  return data;
};

exports.joinClass = async (email, invite_code) => {
  const dataStudent = await classModel.getUserDataByEmail(email);
  const dataClass = await classModel.getClassDataByInviteCode(invite_code);
  let data = null;
  if (!dataClass || !dataStudent) {
    return null;
  }
  const isExist = await classModel.checkExistStudentInClass(dataClass.id, dataStudent.id);
  if (isExist) {
    data = {
      id_class: dataClass.id,
    };
    return data;
  }
  const isExistTeacher = await classModel.checkExistTeacherInClass(dataClass.id, dataStudent.id);
  if (isExistTeacher) {
    data = {
      id_class: dataClass.id,
    };
    return data;
  }
  data = await classModel.joinClass(dataClass.id, dataStudent.id);
  if (data) {
    data = {
      id_class: dataClass.id,
    };
  }
  return data;
};

exports.checkQueueUser = async (email, class_id, role) => {
  const result = await classModel.checkQueueUser(email, class_id, role);
  if (result) {
    const studentList = await classModel.getDataStudentsByClassId(class_id);
    const teacherList = await classModel.getDataTeachersByClassId(class_id);
    const dataClass = await classModel.getClassDataById(class_id);
    if (!dataClass) {
      return null;
    }
    return {
      studentNum: studentList?.length,
      teacherNum: teacherList?.length,
      name: dataClass?.name,
    };
  }
  return result;
};

exports.addQueueUser = async (email, class_id, role) => {
  const dataUser = await classModel.getUserDataByEmail(email);
  if (!dataUser) {
    return null;
  }
  const isExistStudent = await classModel.checkExistStudentInClass(class_id, dataUser.id);
  const isExistTeacher = await classModel.checkExistTeacherInClass(class_id, dataUser.id);
  if (isExistStudent || isExistTeacher) {
    return null;
  }
  const isExist = await classModel.checkQueueUser(email, class_id, role);
  let result = true;
  const studentList = await classModel.getDataStudentsByClassId(class_id);
  const teacherList = await classModel.getDataTeachersByClassId(class_id);
  const dataClass = await classModel.getClassDataById(class_id);
  if (!dataClass) {
    return null;
  }
  if (!isExist) {
    result = await classModel.addQueueUser(email, role, class_id);
    return {
      studentNum: studentList?.length,
      teacherNum: teacherList?.length,
      name: dataClass?.name,
    };
  }
  return {
    studentNum: studentList?.length,
    teacherNum: teacherList?.length,
    name: dataClass?.name,
  };
};

exports.listAssignment = async (user, classId) => {
  const records = await classModel.listAssignment(user, classId);
  if (records) {
    return records;
  }
  return null;
};

exports.deleteAssignment = async (user, body) => {
  const records = await classModel.deleteAssignment(user, body);
  if (records) {
    return records;
  }
  return null;
};

exports.addAssignment = async (user, body) => {
  const records = await classModel.addAssignment(user, body);
  if (records) {
    return records;
  }
  return null;
};

exports.updateAssignment = async (user, body) => {
  const records = await classModel.updateAssignment(user, body);
  if (records) {
    return records;
  }
  return null;
};

exports.updateAssignmentOrder = async (user, body) => {
  const records = await classModel.updateAssignmentOrder(user, body);
  if (records) {
    return records;
  }
  return null;
};

exports.getGradeStructure = async (class_id) => {
  const result = await classModel.getGradeStructure(class_id);
  if (!result) return null;
  const list_syll = await classModel.getSyllabus(result[0]?.id);
  if (!list_syll) {
    return {
      id: "",
      topic: "",
      description: "",
      list_syllabus: [],
    };
  }
  return {
    id: result[0]?.id,
    topic: result[0]?.topic,
    description: result[0]?.description,
    list_syllabus: list_syll,
  };
};

exports.updateGradeStructure = async (object) => {
  try {
    const rs1 = await classModel.removeSyllabus(object?.id);
    const rs2 = await classModel.removeGradeStructure(object?.class_id);
    let list = object?.list_syllabus;
    let index = 0;
    const data = await classModel.addGradeStructure({
      class_id: object?.class_id,
      topic: object?.topic,
      description: object.description,
    });
    for (let item of list) {
      item.order = index;
      let addItem = {
        id: item.id,
        grade_structure_id: data.id,
        subject_name: item.subject_name,
        grade: item.grade,
        order: item.order,
        finalize: item.finalize
      };
      if (item?.new) {
        await classModel.addSyllabusCheck(addItem);
      } else {
        await classModel.addSyllabus(addItem);
      }
      index++;
    }
    const result = await classModel.getGradeStructure(object?.class_id);
    if (!result) return null;
    const list_syll = await classModel.getSyllabus(result[0]?.id);
    if (!list_syll) {
      return {
        id: "",
        topic: "",
        description: "",
        list_syllabus: [],
      };
    }
    return {
      id: result[0]?.id,
      topic: result[0]?.topic,
      description: result[0]?.description,
      list_syllabus: list_syll,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.getGradeTable = async (class_id) => {
  const gradeStructure = await classModel.getGradeStructure(class_id);
  console.log(gradeStructure);
  // if (!gradeStructure || gradeStructure.length === 0) return null;
  const syllabus_list = await classModel.getSyllabus(gradeStructure[0]?.id);
  let sql = `select temp1.*,ARRAY[`
  let tail = `(select SUM(score) from (select s.* from grade_structure gs join syllabus s on s.grade_structure_id = gs.id where class_id = temp1.class_id) as temp2 join student_syllabus ss on temp2.id = ss.syllabus_id where ss.student_code = temp1.student_code)] as list_score
  from (select temp5.*, (case when cs.student_id is not null then true else false end) as isExist from (select csc.*, u.avatar, u.id as student_id from class_student_code csc 
    left join "user" u on u.student_id = csc.student_code where class_id = ${class_id}) as temp5
    left join class_student cs on (cs.student_id = temp5.student_id and cs.class_id = ${class_id}) ) as temp1`
  for (item of syllabus_list) {
    sql += `(select ss.score from syllabus s join student_syllabus ss on s.id = ss.syllabus_id where s.id = ${item.id} and ss.student_code = temp1.student_code),`
  }
  sql += tail;
  const grade_table_list = await classModel.querySelect(sql);
  return {
    id: gradeStructure[0]?.id,
    class_id: gradeStructure[0]?.class_id,
    topic: gradeStructure[0]?.topic,
    description: gradeStructure[0]?.description,
    list_header: syllabus_list,
    grade_table_list: grade_table_list
  };
};

exports.updateScoreStudentSyllabus = async (object) => {
  for (let i = 0; i < object.list_header.length; i++) {
    const isUpdate = await classModel.updateScoreStudentSyllabus(
      object.student_data.list_score[i],
      object.student_data.student_code,
      object.list_header[i].id
    );
  }
  return true;
};

exports.getGradePersonal = async (class_id, user_id) => {
  const result = await classModel.getGradePersonal(class_id, user_id);
  return result;
};

exports.getAllReviewByClassId = async (class_id) => {
  const result = await classModel.getAllGradeReviewByClassId(class_id);
  return result;
}

exports.addReview = async (object) => {
  // console.log(object);
  const result = await classModel.addReview(object);
  return result;
}

exports.sendComment = async (object) => {
  // console.log(global.io);
  // io.emit("send_comment", object);
  // console.log(io.sockets);
  const result = await classModel.addComment(object);
  return result;
}

exports.getCommentByReviewId = async (review_id) => {
  const result = await classModel.getCommentByReviewId(review_id);
  return result;
}

exports.updateStatusComment = async (review_id) => {
  const result = await classModel.updateStatusComment(review_id);
  return result;
}

exports.updateReview = async (object) => {
  const result = await classModel.updateReview(object);
  const userInfo = await classModel.getInfoUserById(object.student_id);
  console.log(userInfo);
  const result3 = await classModel.updateScoreStudentSyllabus(object.final_score, userInfo.student_id, object.syllabus_id);
  return result;
}

exports.getListClassSubcribeSocket = async (object) => {
  const result = await classModel.getListClassSubcribeSocket(object);
  return result;
}

exports.addNotificationPrivate = async (object) => {
  const result = await classModel.addNotificationPrivate(object);
  return result;
}

exports.addNotificationPublic = async (object) => {
  const result = await classModel.addNotificationPublic(object);
  return result;
}

exports.getAllNotification = async (user_id) => {
  const result = await classModel.getAllNotification(user_id);
  return result;
}

exports.updateStatusNotification = async (object) => {
  const result = await classModel.updateStatusNotification(object);
  return result;
}

exports.getAllInfoClass = async (pageSize, page, orderCreatedAt, search) => {
  let allClass = await classModel.getAllClassroom(pageSize, page, orderCreatedAt, search);
  if (!allClass) {
    return [];
  }
  for (let class_info of allClass) {
    class_info["grade_structure"] = await classModel.getSyllabusByClassId(class_info.id);
    class_info["teachers"] = await classModel.getListTeacherByClassIdV2(class_info.id);
    class_info["students"] = await classModel.getListStudentByClassIdV2(class_info.id);
  }
  return allClass;
}

exports.getClassesCount = async () => {
  const result = await classModel.getClassesCount();
  return result;
}

exports.joinClassByCodeBtn = async (student_id, join_code) => {
  const dataStudent = await classModel.getInfoUserById(student_id);
  const dataClass = await classModel.getClassDataByInviteCode(join_code);
  if (!dataClass || !dataStudent) {
    return null;
  }
  const isExist = await classModel.checkExistStudentInClass(dataClass.id, student_id);
  if (isExist) {
    return {
      status: "FAILED",
      msg: "You have already joined this class!"
    };
  }
  const isExistTeacher = await classModel.checkExistTeacherInClass(dataClass.id, student_id);
  if (isExistTeacher) {
    return {
      status: "FAILED",
      msg: "You have already joined this class!"
    };
  }
  // data = await classModel.joinClass(dataClass.id, student_id);
  const result = await classModel.addQueueUser(dataStudent.email,"STUDENT",dataClass.id);
  return {
    status: "SUCCESS",
    msg: "Join class success!",
    path: "/invite/" + dataClass.id + "?role=STUDENT"
  };
}