const classModel = require('../classes/classModel')

//can xu ly
exports.joinClass = async (email, class_id) => {
    const dataStudent = await classModel.getUserDataByEmail(email);
    const dataClass = await classModel.getClassDataById(class_id);
    console.log(dataStudent);
    console.log(dataClass);
    let data = null;
    if (!dataClass || !dataStudent) {
        return null;
    }
    const isExist = await classModel.checkExistTeacherInClass(dataClass.id, dataStudent.id);
    if (isExist) {
        data = {
            id_class: dataClass.id
        }
        return data;
    }
    const isExistStudent = await classModel.checkExistStudentInClass(dataClass.id, dataStudent.id);
    if (isExistStudent) {
        const result = await classModel.removeStudentInClass(dataClass.id, dataStudent.id);
    }
    data = await classModel.joinClassByTeacherRole(dataClass.id, dataStudent.id);
    if (data) {
        data = {
            id_class: dataClass.id
        }
    }
    const result = await classModel.removeQueueUser(dataStudent.email,"TEACHER",dataClass.id);
    return data;
}


exports.joinClassByStudentRole = async (email, class_id) => {
    const dataStudent = await classModel.getUserDataByEmail(email);
    const dataClass = await classModel.getClassDataById(class_id);
    let data = null;
    if (!dataClass || !dataStudent) {
        return null;
    }
    const isExist = await classModel.checkExistStudentInClass(dataClass.id, dataStudent.id);
    if (isExist) {
        data = {
            id_class: dataClass.id
        }
        return data;
    }
    const isExistTeacher = await classModel.checkExistTeacherInClass(dataClass.id, dataStudent.id);
    if (isExistTeacher){
        data = {
            id_class: dataClass.id
        }
        return data;
    }
    data = await classModel.joinClass(dataClass.id, dataStudent.id);
    if (data) {
        data = {
            id_class: dataClass.id
        }
    }
    const result = await classModel.removeQueueUser(dataStudent.email,"STUDENT",dataClass.id);
    return data;
}