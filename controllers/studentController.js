const studentModel = require("../models/studentModel");
const { isExist } = require("../service/checkExist");

async function studentRegister(req, res) {
  const {
    name,
    phoneNo,
    adharNo,
    fatherName,
    parentsPhoneNumber,
    motherName,
    studentClass,
    age,
    pincode,
    district,
    village,
    address,
  } = req.body;
  if (
    !name ||
    !phoneNo ||
    !adharNo ||
    !fatherName ||
    !parentsPhoneNumber ||
    !motherName ||
    !studentClass ||
    !age ||
    !pincode ||
    !district ||
    !village ||
    !address
  ) {
    return res.status(400).json({ message: "All fields requried." });
  }
  const adharData = await studentModel.findOne({ adharNo });
  if (age > 5 && adharData) {
    return res.status(400).json({ message: "Aadhar no allready registered.." });
  }
  try {
    let lastStudentId = await studentModel
      .findOne({}, { sort: { studentId: -1 } })
      .select("studentId");
    if (lastStudentId.studentId) {
      req.body.studentId = lastStudentId.studentId + 1;
      await new studentModel(req.body).save();
      res.status(200).json({ msg: "Admition success" });
    } else {
      req.body.studentId = 1000;
      await new studentModel(req.body).save();
      res.status(200).json({ msg: "Admition success" });
    }
  } catch (err) {
    console.log("errorr", err);
    res.status(400).json({ msg: "Admition failed.." });
  }
}

async function getAllStudents(req, res) {
  try {
    const data = await studentModel.find();
    res.status(200).json({ msg: "Fetch successfully", success: true, data });
  } catch (err) {
    res.status(400).json({ msg: "something went wrong", success: false });
  }
}

async function studentGetById(req, res) {
  const { studentId } = req.body;
  const studentType = typeof studentId;
  if (!studentId) {
    return res
      .status(400)
      .json({ msg: "Student Id is required..", success: false });
  } else if (studentType !== "number") {
    return res
      .status(400)
      .json({ msg: "Student Id is not valid..", success: false });
  }

  try {
    const data = await studentModel.findOne({ studentId });
    if (data) {
      res.status(200).json({ msg: "fetch successfully", success: true, data });
    } else {
      res
        .status(404)
        .json({ msg: "Student Id is not exist..", success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "failed to fetch student..", success: false });
  }
}

async function searchByStudentName(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ msg: "Name is required", success: false });
  }
  try {
    const data = await studentModel.find({ name: new RegExp(name, "i") });
    if (data.length > 0) {
      res.status(200).json({ msg: "search successfully", success: true, data });
    } else {
      res.status(404).json({ msg: "not match..", data: [] });
    }
  } catch (err) {
    res.status(400).json({ msg: "failed to fetch student" });
  }
}

async function searchStudentByClass(req,res) {
  const {studentClass} = req.body
 
  
  const classType = typeof studentClass
  if(!studentClass){
    return res.status(400).json({msg:"Class is required..",success:false})
  } else if (classType !== "number") {
    return res
      .status(400)
      .json({ msg: "Student class is not valid..", success: false });
  }
  
  try{
      const data = await studentModel.find({studentClass})
      // if()
  }catch(err){

  }

}

module.exports = { studentRegister, getAllStudents, studentGetById,searchByStudentName,searchStudentByClass };
