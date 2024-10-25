const express = require("express");
const { readdir } = require("fs");
const { connectDatabase } = require("./config/database");
require("dotenv").config();

const app = express()
const port =5500
app.use(express.json({ limit: "2mb" }));
connectDatabase().then((res) => {
 app.listen(port, () => {
    console.log(`...server is started ${port}`);
  })
})

app.get("/",(req,res)=>{
  res.send({msg:"succes"})
})
readdir("./routes", (error, files) =>
  files.forEach((fileName) => app.use(require("./routes/" + fileName)))
);
