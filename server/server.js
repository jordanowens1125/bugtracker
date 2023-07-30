const createError = require("http-errors");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 8000; //sets port value
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" }); //loads variables from .env file into process.env
const connectDB = require("./config/db");
connectDB();

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.use('/', require('./routes/index'));
//add jwt tokens to calls
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/projects", require("./routes/projects"));
app.use("/tickets", require("./routes/tickets"));
app.use("/comments", require("./routes/comments"));
app.use("/persist", require("./routes/persist"));

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
  res.json({ error: err });
});

app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}.`);
});

module.exports = app;
