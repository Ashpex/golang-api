const userService = require("./userService");

async function updateProfile(req, res) {
  const userObj = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    student_id: req.body.student_id,
    id: req.user.id,
  };
  const new_profile = await userService.updateProfile(userObj);
  if (new_profile) {
    res.status(200).json(new_profile);
  } else {
    res.status(500).json({ message: "Error!" });
  }
}

async function changePassword(req, res) {
  try {
    const result = await userService.changePassword({ id: req.user.id, ...req.body });
    if (result) {
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send();
  }
}

async function getAdmins(req, res) {
  try {
    const pageSize = parseInt(req.query.per_page, 10);
    const page = parseInt(req.query.page, 10);
    const orderCreatedAt = req.query.createdAt;
    const search = req.query.search || "";
    const [result, count] = await Promise.all([
      userService.getAdmins(pageSize, page, orderCreatedAt, search),
      userService.getAdminsCount(),
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
}

async function getUsers(req, res) {
  try {
    const pageSize = parseInt(req.query.per_page, 10);
    const page = parseInt(req.query.page, 10);
    const orderCreatedAt = req.query.createdAt;
    const search = req.query.search || "";
    const [result, count] = await Promise.all([
      userService.getUsers(pageSize, page, orderCreatedAt, search),
      userService.getUsersCount(),
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
}

async function createAdmin(req, res) {
  try {
    const result = await userService.createAdmin(req.body);
    if (result) {
      res.status(201).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send();
  }
}

async function getAllUsers(req, res) {
  const result = await userService.getAllUsers();
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ message: "Error!" });
  }
}

async function updateStatusUser(req, res) {
  const result = await userService.updateStatusById(req.body.rowData);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ message: "Error!" });
  }
}

async function updateStudentCode(req, res) {
  console.log(req.body);
  const result = await userService.updateStudentCodeById(req.body.newData);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ message: "Error!" });
  }
}
async function getUsers(req, res) {
  try {
    const pageSize = parseInt(req.query.per_page, 10);
    const page = parseInt(req.query.page, 10);
    const orderCreatedAt = req.query.createdAt;
    const search = req.query.search || "";
    const [result, count] = await Promise.all([
      userService.getUsers(pageSize, page, orderCreatedAt, search),
      userService.getUsersCount(),
    ]);
    if (result) {
      res.status(200).json({
        data: result,
        page,
        total: count,
      });
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}

async function getUsersCount(req, res) {
  try {
    const count = parseInt(await userService.getUsersCount(), 10);
    console.log(count);
    if (count) {
      res.status(200).json({ count });
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send();
  }
}

module.exports = {
  updateProfile,
  changePassword,
  getAdmins,
  createAdmin,
  getUsers,
  getAllUsers,
  updateStatusUser,
  updateStudentCode,
  getUsersCount,
};
