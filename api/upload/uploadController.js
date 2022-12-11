const fs = require("fs");
const multer = require("multer");
const xlsx = require("xlsx");
const uploadService = require("./uploadService");
const path = require("path");

//multer store files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage }).single("file");

module.exports = {
  uploadClassList(req, res, next) {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }

      const path = `public/upload/${req.file.filename}`;
      const workbook = xlsx.readFile(path);
      let worksheets = {};

      for (const sheetName of workbook.SheetNames) {
        worksheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      }

      let result = null;
      try {
        result = await uploadService.uploadClassList(req.body.id, worksheets.Sheet1);
      } catch (err) {
        console.log(err);
        res.status(400).send(err);
      }
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      if (result) res.status(200).json(result);
      else res.status(400).send("Something's wrong");
    });
  },
  downloadStudentList: (req, res, next) => {
    const file = `public/template xlsx/demo ds lớp.xlsx`;
    res.download(file); // Set disposition and send it.
  },
  downloadGradeList: async (req, res) => {
    const result = await uploadService.downloadGradeList(req.query.class_id);
    if (result) {
      const file = `public/template xlsx/download_grade.xlsx`;
      res.download(file);
    } else {
      res.status(500).json({ message: "not ok" });
    }
  },
  downloadGradeTable: async (req, res) => {
    const result = await uploadService.downloadGradeTable(req.query.class_id);
    if (result) {
      res.download(result);
    } else {
      res.status(500).json({ message: "not ok" });
    }
  },
  uploadGradeList(req, res, next) {
    upload(req, res, function (err) {
      console.log(err);
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }

      const path = `public/upload/${req.file.filename}`;
      const workbook = xlsx.readFile(path);
      let worksheets = {};

      for (const sheetName of workbook.SheetNames) {
        worksheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      }
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      const invalidPoint = worksheets.download_grade.find(
        (row) => row.Grade > req.body.syllabus_maxGrade
      );
      if (invalidPoint) {
        return res.status(409).json({ error: 1 });
      }

      uploadService
        .uploadGradeList(req.body.syllabus_id, worksheets.download_grade)
        .then((result) => {
          console.log(result);
          res.status(200).send(req.file);
        })
        .catch((err) => {
          console.log(err);
        });
      // fs.unlink(path, (err) => {
      //   if (err) {
      //     console.error(err);
      //     return;
      //   }
      // });
      // return res.status(200).send(req.file);
    });
  },
};
