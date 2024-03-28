const express = require("express");
const route = express.Router();

const {teacherLogin,createTeacher} = require("../controllers/teacherController")


route.post("/teacher/signup", createTeacher);

route.post("/teacher/signin", teacherLogin);

module.exports = route;
