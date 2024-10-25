
const Router = require("express").Router();
const {studentRegister,getAllStudents,studentGetById,searchByStudentName,searchStudentByClass} = require("../controllers/studentController")

Router.post("/student-register", studentRegister);
Router.get("/get-all-students", getAllStudents);
Router.post("/student-get-by-id", studentGetById);
Router.post("/search-student-by-name", searchByStudentName);
Router.post("/search-student-by-class", searchStudentByClass);
module.exports = Router