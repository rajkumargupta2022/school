async function isExist(data,model) {
   const existData =await model.findOne(data)
   if(existData){
    return true
   }else{
    return false
   }
}

module.exports={
  isExist
}