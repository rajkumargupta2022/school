
const feeModel = require("../models/feeModel");
const studentModel = require("../models/studentModel");
const { months } = require("../utils/months");

async function feeSubmit(req, res) {
  let   { studentId, fees } = req.body;
  if (!studentId) {
    return res
      .status(400)
      .json({ msg: "Student Id is required..", success: false });
  }
  if (!fees) {
    return res.status(400).json({ msg: "Fees is required..", success: false });
  } else if (isNaN(fees)) {
    return res.status(400).json({ msg: "Fee is not valid..", success: false });
  }

  let studentData = await studentModel.aggregate([
    { $match: { studentId: studentId } },
    {
      $lookup: {
        from: "fees",
        localField: "studentId",
        foreignField: "studentId",
        as: "studentFees",
      },
    },
  ]);
  studentData = studentData[0];
  let feeArray = [];
  // console.log("==", studentData);

  if (studentData?.studentFees[0]?.feeMonths?.length > 0) {
    const lastMonth = studentData?.studentFees[0].feeMonths.reduce(
      (max, product) => (product.month > max.month ? product : max)
    );
    feeArray = studentData?.studentFees[0].feeMonths
    feeArray =feeArray.filter(item => item.isFinal)

    
    if (lastMonth?.fee && !lastMonth.isFinal) {
      feeArray.push({
        month: lastMonth.month,
        monthName: months[lastMonth.month],
        fee: studentData.monthlyFee,
        isFinal: true,
      });
      fees = fees - (studentData.monthlyFee - lastMonth.fee);
      let totalFinalMonth = parseInt(fees / studentData.monthlyFee);
      let remainigFee = fees % studentData.monthlyFee;
      if (totalFinalMonth > 0) {
        for (let i = 1; i <= totalFinalMonth; i++) {
          if(lastMonth.month+i<=12){
            feeArray.push({
              month: lastMonth.month + i,
              monthName: months[lastMonth.month + i],
              fee: studentData.monthlyFee,
              isFinal: true,
            });
          }else{
            return res.status(400).json({msg:"Amount enough for this year.."})
          }
         
        }
      }
      if (remainigFee > 0) {
        feeArray.push({
          month: lastMonth.month + totalFinalMonth + 1,
          monthName: months[lastMonth.month+totalFinalMonth + 1],
          fee: remainigFee,
          isFinal: false,
        });
      }
      console.log("feeArray",feeArray);
      
      try {
        const data = await feeModel.findOneAndUpdate({ studentId },  { $set: { feeMonths:feeArray } });
        res.status(200).json({ msg: "fee submitt succesffuly",data });
      } catch (err) {
        console.log(err);
        res.status(400).json({ msg: "fee submitt failed" });
      }
    }
  } else {
    let totalFinalMonth = parseInt(fees / studentData.monthlyFee);
    let remainigFee = fees % studentData.monthlyFee;
    if (totalFinalMonth > 0) {
      for (let i = 1; i <= totalFinalMonth; i++) {
        feeArray.push({
          month: i,
          monthName: months[i],
          fee: studentData.monthlyFee,
          isFinal: true,
        });
      }
    }
    if (remainigFee > 0) {
      feeArray.push({
        month: totalFinalMonth + 1,
        monthName: months[totalFinalMonth + 1],
        fee: remainigFee,
        isFinal: false,
      });
    }
    try {
      const result = await new feeModel({
        studentId,
        feeMonths: feeArray,
      }).save();
      res.status(200).json({ msg: "submit successfully", data: result });
    } catch (err) {
      console.log(err);

      res.status(400).json({ msg: "submit failed" });
    }
  }
}


async function getStudentFee(req,res) {
  const {studentId} = req.body
  if(!studentId){
   return res.status(400).json({msg:"Student Id is required..."})
  }
  try{
    const data =await studentModel.aggregate([
      { $match: { studentId } },
      {
        $lookup:{
          from:"fees",
          localField:"studentId",
          foreignField:"studentId",
          as:"feeList"
        }
      },
      {
        $unwind: {
            path: "$feeList",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $addFields: {
            feeMonths: "$feeList.feeMonths"
        }
    },
    {
        $project: {
            feeList: 0, // Exclude the original feeList field
            "feeMonths.createdAt": 0,
            "feeMonths.updatedAt": 0,
            "feeMonths.__v": 0,
            "_id":0
        }
    }
    
    ])

    
    if(data){
      res.status(200).json({msg:"Fetch Successfully",data})
    }else{
      res.status(404).json({msg:"Data not found",data})
    }


  }catch(err){
    console.log(err);
    
    res.status(400).json({msg:"Fetch failed"})
  }
}
module.exports = { feeSubmit,getStudentFee };
