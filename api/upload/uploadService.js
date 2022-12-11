const uploadModel = require("./uploadModel");
const xlsx = require("xlsx");
const classService = require("../classes/classService");
const path = require("path");
const classModel = require("../classes/classModel");

module.exports = {
  async uploadClassList(class_id, student_list) {
    return await uploadModel.uploadClassList(class_id, student_list);
  },
  downloadGradeList: async (class_id) => {
    const result = await uploadModel.getStudentGradeList(class_id);
    const wb = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(result);
    workSheet["A1"]["v"] = "StudentId";
    workSheet["B1"]["v"] = "Grade";
    xlsx.utils.book_append_sheet(wb, workSheet, `download_grade`);
    let exportFileName = `public/template xlsx/download_grade.xlsx`;
    xlsx.writeFile(wb, exportFileName);
    return result;
  },
  downloadGradeTable: async (class_id) => {
    // const result =  classService.getGradeTable(class_id);

    const gradeStructure = await classModel.getGradeStructure(class_id);
    if (!gradeStructure || gradeStructure.length === 0) return null;
    const syllabus_list = await classModel.getSyllabus(gradeStructure[0].id);
    const listStudentCode = await classModel.getAllStudentGradeStructure(class_id);
    let maxScoreList = [];
    let Heading = [];
    let headList = ["Student"];
    let arr = [];
    let wscols = [{ wch: 30 }];

    total_max = 0;
    for (item of syllabus_list) {
      maxScoreList.push(item.grade);
      total_max = total_max + item.grade;
      let str = item.subject_name + " (" + item.grade + "/" + item.grade + ")";
      headList.push(str);
      wscols.push({ wch: str.length });
    }
    let totalStr = "Total " + " (" + total_max + "/" + total_max + ")";
    headList.push(totalStr);
    Heading.push(headList);
    wscols.push({ wch: totalStr.length + 5 });

    maxScoreList.push(total_max);
    syllabus_list.push({
      id: 1000,
      subject_name: "Total",
      grade: total_max,
    });

    const numberSyllabus = await classModel.countSyllabus(gradeStructure[0].id);

    for (studentCode of listStudentCode) {
      total = 0;
      const studentInfo = await classModel.getInfoStudentGradeStructure(studentCode.student_code);
      let dataStudent = {
        student_info: studentInfo[0].full_name + " - " + studentCode.student_code,
      };
      for (let i = 0; i < Number(numberSyllabus.sl); i++) {
        let score = await classModel.getListScoreOfStudent(
          gradeStructure[0].id,
          studentCode.student_code,
          i
        );
        // console.log(score);
        if (Number(score?.score)) {
          total = total + Number(score?.score);
          dataStudent["score" + i] = Number(score?.score);
        } else {
          dataStudent["score" + i] = null;
        }
      }
      dataStudent["score" + Number(numberSyllabus.sl)] = total;
      arr.push(dataStudent);
    }

    //Had to create a new workbook and then add the header
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet([]);
    xlsx.utils.sheet_add_aoa(ws, Heading);

    //Starting in the second row to avoid overriding and skipping headers
    xlsx.utils.sheet_add_json(ws, arr, { origin: "A2", skipHeader: true });

    ws["!cols"] = wscols;
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    const fileName = "public/template xlsx/grade_table_" + class_id + ".xlsx";
    xlsx.writeFile(wb, fileName);
    return fileName;
  },
  uploadGradeList(class_id, grade_list) {
    return uploadModel.uploadGradeList(class_id, grade_list);
  },
};
