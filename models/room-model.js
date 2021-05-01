const mongoose = require("mongoose");
const { Schema } = mongoose

const RoomModel = new Schema({
  name: {
    type: String, 
    required: true
  },
  tags: [{
    type: String
  }],
  organizer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }, 
  participants: [{
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }, 
    type: {
      type: String, 
      required: true
    }
  }],
  isDebate: {
    type: Boolean,
    required: true
  },
  isPublic: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
})

const Room = mongoose.model("Room", RoomModel);

module.exports = { Room }