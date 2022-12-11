require("dotenv").config();
const classService = require("./api/classes/classService");

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("./modules/passport");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
global.cache = myCache;

const indexRouter = require("./routes/index");
const classroomRouter = require("./api/classes");
const syllabusRouter = require("./api/syllabus");
const registerRouter = require("./api/auth");
const authRouter = require("./api/authenticate");
const sendMailRouter = require("./api/sendMail");
const userRouter = require("./api/user");
const uploadRouter = require("./api/upload");
const verifiedRouter = require("./api/verified");

const app = express();

app.disable("etag");
app.use(passport.initialize());
const cors = require("cors");

const allowedOrigins = ["http://localhost:3000", "http://yourapp.com"];

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);
app.use("/classroom", passport.authenticate("jwt", { session: false }), classroomRouter);
app.use("/syllabus", passport.authenticate("jwt", { session: false }), syllabusRouter);
app.use("/sendMail", sendMailRouter);
app.use("/auth", authRouter);
app.use("/register", registerRouter);
app.use("/verified", verifiedRouter);
app.use("/upload", passport.authenticate("jwt", { session: false }), uploadRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// const server = require('http').createServer(app);
// const socketio = require('socket.io');
// const io = socketio(server);

// io.on('connection', (socket) => {
//   console.log(socket.id);
//   socket.on("join_room", (data) => {
//     console.log("join room", data);
//     socket.join(data);
//   })
//   socket.on("send_comment", (data) => {
//     console.log(data);
//     socket.to(data.review_id).emit("receive_comment_" + data.review_id, data);
//     classService.sendComment(data);
//   })
//   socket.on("send_notification", (data) => {
//     console.log(data);
//     socket.to("class_" + data.class_id).emit("receive_notification_" + data.class_id + "_" + data.to_role_name, data);
//     classService.addNotificationPublic(data);
//   })
//   socket.on("send_notification_private", (data) => {
//     console.log(data);
//     socket.to("class_private_" + data.to_user).emit("receive_notification_private_" + data.to_user, data);
//     classService.addNotificationPrivate(data);
//   })
//   socket.on("disconnect", () => {
//     console.log("User disconnect");
//   })
// });

module.exports = app;
