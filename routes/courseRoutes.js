const express = require("express");
const app = express.Router();
const {getAllCourse,createCourse} = require("../controllers/courseController")

app.get("/courses", getAllCourse);

app.post("/courses", createCourse);
module.exports = app;
