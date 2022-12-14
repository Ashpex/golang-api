const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const databaseService = require("./services/database.service");
const verifyToken = require("./middlewares/auth.middleware");
const UserRoute = require("./routes/user.route");
const AuthRoute = require("./routes/auth.route");
require("dotenv").config();

databaseService.connectDatabase();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", AuthRoute);
app.use("/api/users", verifyToken, UserRoute);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`);
});
