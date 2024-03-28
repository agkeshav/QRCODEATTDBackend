const express = require("express");
const app = express.Router();


const { getAllStudents, getStudentCourse } = require("../controllers/studentController");

app.get("/students", getAllStudents);

app.get("/studentcourses",getStudentCourse);
module.exports = app;
