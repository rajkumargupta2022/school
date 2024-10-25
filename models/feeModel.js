const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema(
  {
    studentId:{
      type: Number,
      required: true,
      unique:true
    },
    feeMonths: [
      {
        month: { type: Number },
        monthName: { type: String },
        fee: { type: Number },
        isFinal:{type:Boolean}
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("fees", schema);
