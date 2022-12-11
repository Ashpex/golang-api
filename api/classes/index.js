const express = require("express");
const router = express.Router();
const classController = require("./classController");

router.get("/", classController.listClassByUserId);

router.post("/", classController.create);

router.post("/invite_teacher", classController.invite);

router.post("/invite_student", classController.invite_student);

router.get("/detail/:id", classController.getDetailClass);

router.post("/join", classController.joinClass);

router.post("/invitation", classController.checkQueueUser);

router.post("/add-queue", classController.addQueueUser);

router.get("/assignment/:id", classController.listAssignment);

router.delete("/class/:classId/assignment/:assignmentId", classController.deleteAssignment);

router.post("/assignment", classController.addAssignment);

router.put("/assignment", classController.updateAssignment);

router.put("/assignment/order", classController.updateAssignmentOrder);

router.get("/grade-structure", classController.getGradeStructure);

router.put("/grade-structure", classController.updateGradeStructure);

router.get("/grade-table", classController.getGradeTable);

router.put("/grade-table", classController.updateScoreStudent);

router.get("/grade-personal", classController.getClassPersonal);

router.get("/all-review", classController.getAllReview);

router.post("/add-review", classController.addReview);

router.get("/all-comment", classController.getComment);

router.put("/update-comment-status", classController.updateStatusComment);

router.put("/update-review", classController.updateReview)

router.get("/all-channel", classController.getListClassSubcribeSocket)

router.get("/all-notifications", classController.getAllNotification)

router.put("/update-status-notifications", classController.updateStatusNotification)

router.get("/all-classrooms", classController.getAllInfoClass)

router.post("/join-by-code", classController.joinClassByCodeBtn);

module.exports = router;
