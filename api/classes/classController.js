const classService = require("./classService");

exports.list = async (req, res) => {
  const classes = await classService.list();
  if (classes) {
    res.status(200).json(classes);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.listClassByUserId = async (req, res) => {
  const classes = await classService.listClassByUserId(req.user.id);
  if (classes) {
    res.status(200).json(classes);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.create = async (req, res) => {
  const classObj = {
    name: req.body.name,
    section: req.body.section,
    topic: req.body.topic,
    description: req.body.description,
  };
  const isSuccess = await classService.create(req.user.id, classObj);
  if (isSuccess) {
    res.status(201).json(isSuccess);
  } else {
    res.status(500).json({ message: "Error!" });
  }
};

exports.invite = async (req, res) => {
  const error_list = await classService.inviteByMail(req.body.list_email, req.body.invite_code);
  if (!error_list.length) {
    res.status(201).json({ message: "Send mail success!" });
  } else {
    res.status(404).json({ message: "Error!", list_error: error_list });
  }
};

exports.invite_student = async (req, res) => {
  const error_list = await classService.inviteByMailToStudent(
    req.body.list_email,
    req.body.invite_code
  );
  if (!error_list.length) {
    res.status(201).json({ message: "Send mail success!" });
  } else {
    res.status(404).json({ message: "Error!", list_error: error_list });
  }
};

exports.getDetailClass = async (req, res) => {
  const isSuccess = await classService.getDetailClass(req.params.id, req.user.id);
  if (isSuccess) {
    if (isSuccess == 403) {
      res.status(403).json({ message: "Dont have permission" });
    } else {
      res.status(200).json(isSuccess);
    }
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.joinClass = async (req, res) => {
  const isSuccess = await classService.joinClass(req.body.email, req.body.invite_code);
  if (isSuccess) {
    res.status(201).json({ message: "Join class success!" });
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.checkQueueUser = async (req, res) => {
  const isSuccess = await classService.checkQueueUser(
    req.body.email,
    req.body.class_id,
    req.body.role
  );
  if (isSuccess) {
    console.log(isSuccess);
    res.status(200).json(isSuccess);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.addQueueUser = async (req, res) => {
  const isSuccess = await classService.addQueueUser(
    req.body.email,
    req.body.class_id,
    req.body.role
  );
  if (isSuccess) {
    console.log(isSuccess);
    res.status(200).json(isSuccess);
  } else {
    res.status(404).json({ message: "Error!" });
  }
};

exports.listAssignment = async (req, res) => {
  const record = await classService.listAssignment(req.user, req.params.id);
  if (record) {
    res.status(200).json(record[1]);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.deleteAssignment = async (req, res) => {
  const record = await classService.deleteAssignment(req.user, req.params);
  if (record) {
    res.status(200).json({ message: "ok" });
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.addAssignment = async (req, res) => {
  const isSuccess = await classService.addAssignment(req.user, req.body);
  if (isSuccess) {
    res.status(201).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.updateAssignment = async (req, res) => {
  const isSuccess = await classService.updateAssignment(req.user, req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.updateAssignmentOrder = async (req, res) => {
  const isSuccess = await classService.updateAssignmentOrder(req.user, req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.getGradeStructure = async (req, res) => {
  const isSuccess = await classService.getGradeStructure(req.query.class_id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(400).json({ message: "Bad request" });
  }
};

exports.updateGradeStructure = async (req, res) => {
  // console.log(req.body);
  const isSuccess = await classService.updateGradeStructure(req.body);
  // const isSuccess = await classService.updateAssignmentOrder(req.user, req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.getGradeTable = async (req, res) => {
  // console.log(req.body);
  const isSuccess = await classService.getGradeTable(req.query.class_id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.updateScoreStudent = async (req, res) => {
  const isSuccess = await classService.updateScoreStudentSyllabus(req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.getClassPersonal = async (req, res) => {
  const isSuccess = await classService.getGradePersonal(req.query.class_id, req.query.user_id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.getAllReview = async (req, res) => {
  const isSuccess = await classService.getAllReviewByClassId(req.query.class_id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.addReview = async (req, res) => {
  const isSuccess = await classService.addReview(req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.getComment = async (req, res) => {
  const isSuccess = await classService.getCommentByReviewId(req.query.review_id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.updateStatusComment = async (req, res) => {
  const isSuccess = await classService.updateStatusComment(req.body.review_id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.updateReview = async (req, res) => {
  const isSuccess = await classService.updateReview(req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.getListClassSubcribeSocket = async (req, res) => {
  const isSuccess = await classService.getListClassSubcribeSocket(req.user.id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.getAllNotification = async (req, res) => {
  const isSuccess = await classService.getAllNotification(req.user.id);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.updateStatusNotification = async (req, res) => {
  const isSuccess = await classService.updateStatusNotification(req.body);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};

exports.getAllInfoClass = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.per_page, 10);
    const page = parseInt(req.query.page, 10);
    const orderCreatedAt = req.query.createdAt;
    const search = req.query.search || "";
    const [result, count] = await Promise.all([
      classService.getAllInfoClass(pageSize, page, orderCreatedAt, search),
      classService.getClassesCount(),
    ]);
    if (result) {
      res.status(200).json({
        data: result,
        page,
        total: parseInt(count, 10),
      });
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.joinClassByCodeBtn = async (req, res) => {
  console.log(req.body);
  const isSuccess = await classService.joinClassByCodeBtn(req.user.id, req.body.invite_code);
  if (isSuccess) {
    res.status(200).json(isSuccess);
  } else {
    res.status(500).json({ message: "not ok" });
  }
};