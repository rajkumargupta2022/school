const Router = require("express").Router()
const { feeSubmit, getStudentFee } = require("../controllers/feeController")


Router.post("/fee-submit",feeSubmit)
Router.post("/get-student-fee",getStudentFee)
module.exports = Router