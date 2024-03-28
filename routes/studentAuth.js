const express = require("express");
const route = express.Router();
const {
  createStudent,
  loginStudent,
} = require("../controllers/studentController");

route.post("/student/signup", createStudent);

route.post("/student/signin", loginStudent);

module.exports = route;
