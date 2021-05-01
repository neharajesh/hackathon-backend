const express = require("express");

const { initializeDbConnection } = require("./db/db-setup");
initializeDbConnection();

const app = express();

const PORT = process.env['PORT']

app.get("/", (req, res) => {
  res.json({success: true, message: "connection successful"})
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});