const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }, 
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room"
  }
},{
  timestamps: true
})

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = { Chat }