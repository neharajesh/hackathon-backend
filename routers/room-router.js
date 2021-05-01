const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const lodash = require("lodash")
const {extend} = lodash

const { Room } = require("../models/room-model");

router.route("/")
.get(async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).json(rooms);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Data could not be retrieved due to an error",
      errMessage: err.message
    })
  }
})
.post(async (req, res) => {
  try {
    const room = req.body
    const newRoom = new Room(room);
    const savedRoom = await newRoom.save();
    res.status(200).json(savedRoom);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Could not add new user, try again later",
      errMessage: err.message
    })
  }
})

router.param("id", async(req, res, next, id) => {
  try{
    const room = await Room.findById(id);
    if(!room) {
      return res.status(404).json({success: false, message: "could not find room"})
    }
    req.room = room;
    next()
  } catch (err) {
    res.status(400).json({success: false, message: "an error occurred while retrieving room", errMessage: err.message})
  }
})

router.route("/:id")
.get((req, res) => {
  let {room} = req;
  room.__v = undefined;
  res.status(200).json({success: true, room})
})
.post(async (req, res) => {
  let {room} = req;
  let roomUpdates = req.body;
  room = extend(room, roomUpdates)
  try {
    room = await room.save();
    res.status(200).json({success: true, message: "room updated", room})
  } catch (err) {
    res.status(500).json({success: false, message: "an error occurred", errMessage: err.message})
  }
})
.delete(async(req, res) => {
  let {room} = req
  try {
    await room.remove()
    res.json({success: true, message: "room successfully removed"})
  } catch (err) {
    res.json({success: false, message: "room could not be removed"})
  }
})

module.exports = router;