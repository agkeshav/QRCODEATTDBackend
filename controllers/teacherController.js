const Teacher = require("../models/Teacher");
const jwt = require("jsonwebtoken");

const generateRandomNumber = () => {
  let x = Math.floor(Math.random() * 100000 + 1);
  return x;
};

const teacherLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    let teacherId;
    if (!email || !password) {
      return res
        .status(422)
        .json({ success: false, msg: "Please provide email or password" });
    }
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res
        .status(422)
        .json({ success: false, msg: "Email Does Not Exist" });
    }
    teacherId = teacher.teacherId;
    try {
      await teacher.comparePassword(password);
      const token = jwt.sign({ userId: teacher._id }, "MY_SECRET_KEY");
      res.send({ token, teacherId });
    } catch (err) {
      return res.status(422).json({ success: false, msg: "Wrong Password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
    console.log(err);
  }
};
const createTeacher = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = email.toLowerCase();
    let teacherId = generateRandomNumber();
    const checkTeacher = await Teacher.findOne({ email });
    if (checkTeacher) {
      return res
        .status(500)
        .json({ success: false, msg: "Teacher already Exist" });
    }
    let check = await Teacher.findOne({ teacherId });
    while (check) {
      teacherId = generateRandomNumber();
      check = await Teacher.findOne({ teacherId });
    }
    const teacher = await Teacher.create({
      name,
      teacherId,
      email,
      password,
    });
    const token = jwt.sign({ userId: teacher._id }, "MY_SECRET_KEY");
    res.send({ token, teacherId });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};
const getTeacherCourses = async (req, res) => {
  const { teacherId } = req.query;
  var result = [];
  try {
    const teacher = await Teacher.findOne(
      { teacherId: teacherId },
      { courses: 1, _id: 0 }
    ).populate("courses");
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, msg: "No teacher find with this Teacher Id" });
    }
    teacher.courses.map((item) => {
      result.push({ courseId: item.courseId, courseName: item.courseName });
    });
    res.status(200).json({ success: true, msg: result });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

module.exports = { getTeacherCourses, teacherLogin, createTeacher };
