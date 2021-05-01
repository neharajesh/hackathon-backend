const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const lodash = require("lodash")
const {extend} = lodash

const { Chat } = require("../models/chat-model");

router.route("/")
.get(async (req, res) => {
  try {
    const chats = await Chat.find({});
    res.status(200).json(chats);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Data could not be retrieved due to an error",
      errMessage: err.message
    })
  }
})

router.param("id", async(req, res, next, id) => {
  try{
    const chat = await Chat.findById(id);
    if(!chat) {
      return res.status(404).json({success: false, message: "could not find chat"})
    }
    req.chat = chat;
    next()
  } catch (err) {
    res.status(400).json({success: false, message: "an error occurred while retrieving chat", errMessage: err.message})
  }
})

router.route("/:id")
.get((req, res) => {
  let {chat} = req;
  chat.__v = undefined;
  res.status(200).json({success: true, chat})
})
.post(async (req, res) => {
  let {chat} = req;
  let chatUpdates = req.body;
  chat = extend(chat, chatUpdates)
  try {
    chat = await chat.save();
    res.status(200).json({success: true, message: "chat updated", chat})
  } catch (err) {
    res.status(500).json({success: false, message: "an error occurred", errMessage: err.message})
  }
})
.delete(async(req, res) => {
  let {chat} = req
  try {
    await chat.remove()
    res.json({success: true, message: "chat successfully removed"})
  } catch (err) {
    res.json({success: false, message: "chat could not be removed"})
  }
})

module.exports = router;