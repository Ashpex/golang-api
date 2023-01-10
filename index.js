const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const databaseService = require("./services/database.service");
const verifyToken = require("./middlewares/auth.middleware");
const UserRoute = require("./routes/user.route");
const AuthRoute = require("./routes/auth.route");
const GroupRoute = require("./routes/group.route");
const PresentationRoute = require("./routes/presentation.route");
const MessageRoute = require("./routes/message.route");
require("dotenv").config();

databaseService.connectDatabase();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", AuthRoute);
app.use("/api/users", verifyToken, UserRoute);
app.use("/api/groups", verifyToken, GroupRoute);
app.use("/api/presentations", verifyToken, PresentationRoute);
app.use("/api/messages", verifyToken, MessageRoute);

app.use("/api", (req, res) => {
  res.json("Welcome api Class Group!");
});

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`App listening on port ${process.env.PORT || 5000}`);
});

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

socketIo.on("connection", (socket) => {
  socket.on("memberAnswer", function (data) {
    socketIo.emit("memberAnswer", { data });
  });

  socket.on("updateOptions", function (data) {
    socketIo.emit("updateOptions", { data });
  });

  socket.on("getMessages", function (data) {
    socketIo.emit("getMessages", { data });
  });

  socket.on("createSlideShow", function (data) {
    console.log("createSlideShow", data);
    socketIo.emit("createSlideShow", { data });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
