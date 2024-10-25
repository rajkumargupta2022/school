const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phoneNo: {
      type: String
    },

    adharNo: {
      type: String,
      required: true,
      unique: true,
    },

    fatherName: {
      type: String,
      required: true
    },
    parentsPhoneNumber: {
      type: String,
      required: true
    },
    motherName: {
      type: String,
      required: true
    },
    studentClass: {
      type: Number,
      required: true,
    },
    monthlyFee:{
      type:Number,
      required:true,
    },
    age:{
      type: Number,
      required: true,
    },
    address:{
      type: String,
      required: true,
    },
    studentId:{
      type: Number,
      required: true,
      unique:true
    },
    pincode:{
      type:String,
      required:true,
    }, 
    district:{
      type:String,
      required:true,
    },
    village:{
      type:String,
      required:true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = model("students", schema);
