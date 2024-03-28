const express = require("express");
const app = express.Router();
const {
  studentAttendance,
  teacherAttendance,
  createAttendance,
} = require("../controllers/attendanceController");

app.post("/attendance", createAttendance);

app.get("/studentattendance", studentAttendance);

app.get("/teacherattendance", teacherAttendance);

module.exports = app;
