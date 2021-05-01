const mongoose = require("mongoose");

const MONGODB_URI = process.env['MONGODB_URI']

const initializeDbConnection = async() => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("Database Connection Successful")
  } catch (err) {
    console.log("Database Connection Failed,", err.message)
  }
}

module.exports = { initializeDbConnection }