const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors")

const { initializeDbConnection } = require("./db/db-setup");
initializeDbConnection();

const app = express();
app.use(bodyParser.json());
app.use(cors())
const PORT = process.env['PORT'];

const userRouter = require("./routers/user-router");
const roomRouter = require("./routers/room-router");

app.use("/users", userRouter);
app.use("/rooms", roomRouter);

app.get("/", (req, res) => {
  res.json({success: true, message: "connection successful"})
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});