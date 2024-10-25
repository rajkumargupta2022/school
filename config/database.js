const mongoose = require("mongoose");

async function connectDatabase() {
  await mongoose.connect(process.env.DATABASE_LOCALHOST);
  console.log("database connected.");
}

module.exports = {
  connectDatabase,
};
