const mongoose = require("mongoose");
const { Schema } = mongoose

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  currentChatroom: {
    type: Schema.Types.ObjectId
  },
  chatrooms: [
    {roomId: Schema.Types.ObjectId, 
    participationType: {
      type: String,
      required: true
    }}
  ], 
  interests: [{
    type: String
  }]
})

const User = mongoose.model("User", UserSchema);

module.exports = { User }