const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieParser = require("cookie-parser");

const { initializeDbConnection } = require("./db/db-setup");
initializeDbConnection();

app.use(bodyParser.json());
app.use(cors())
app.use(cookieParser());
const PORT = process.env['PORT'];

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const { auth } = require("./middleware/auth");

const userRouter = require("./routers/user-router");
const roomRouter = require("./routers/room-router");
const chatRouter = require("./routers/chat-router");

app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/chats", chatRouter);

io.on("connection", socket => {
  socket.on("Input Chat Message", msg => {
    connect.then(db => {
      try {
          const chat = new Chat({ message: msg.chatMessage, sender:msg.userId, type: msg.type })
          const savedChat = chat.save((msg) => {
            try{ 
              Chat.find({ "_id": msg._id }).populate("sender").exec(() => io.emit(msg))
            } catch(err) {
              console.log("error occurred", err.message);
            }
          });
      } catch (error) {
        console.error(error);
      }
    })
   })
})

app.get("/", (req, res) => {
  res.json({success: true, message: "connection successful"})
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});