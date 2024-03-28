const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

const loginStudent = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    if (!email || !password) {
      return res
        .status(422)
        .json({ success: false, msg: "Please provide email or password" });
    }
    const student = await Student.findOne({ email });
    console.log(student);
    if (!student) {
      return res
        .status(422)
        .json({ success: false, msg: "Email Does Not Exist" });
    }
    try {
      await student.comparePassword(password);
      const token = jwt.sign({ userId: student._id }, "MY_SECRET_KEY");
      res.send({ token });
    } catch (err) {
      console.log(err);
      return res.status(422).json({ success: false, msg: "Wrong Password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};
const createStudent = async (req, res) => {
  try {
    let { name, email, rollNo, password } = req.body;
    email = email.toLowerCase();
    rollNo = rollNo.toUpperCase();
    const checkStudent = await Student.findOne({ rollNo });
    if (checkStudent) {
      return res
        .status(500)
        .json({ success: false, msg: "Student already Exist" });
    }
    const student = await Student.create({
      name,
      rollNo,
      email,
      password,
    });
    const token = jwt.sign({ userId: student._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};
const getAllStudents = async (req, res) => {
  try {
    const allStudents = await Student.find(
      {},
      { name: 0, password: 0, studentCourses: 0, email: 0, _id: 0, __v: 0 }
    );
    res.status(200).json({ msg: allStudents, success: true });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", success: false });
  }
};

const getStudentCourse = async (req, res) => {
  const { rollNo } = req.query;
  var courses = [];
  try {
    const student = await Student.findOne(
      { rollNo: rollNo },
      { studentCourses: 1, _id: 0 }
    ).populate("studentCourses");
    if (!student) {
      return res
        .status(404)
        .json({ success: false, msg: "No student find with this Roll No" });
    }
    student.studentCourses.map((item) => {
      courses.push({ courseId: item.courseId, courseName: item.courseName });
    });
    res.status(200).json({ success: true, msg: courses });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

module.exports = { getAllStudents, getStudentCourse, createStudent,loginStudent };
