const express = require("express");
const app = express.Router();
const { getTeacherCourses } = require("../controllers/teacherController");

app.get("/teachercourses", getTeacherCourses);
module.exports = app;
