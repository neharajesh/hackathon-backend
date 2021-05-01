const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const lodash = require("lodash")
const {extend} = lodash

const { User } = require("../models/user-model");

router.route("/")
.get(async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
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
    const user = req.body
    const newUser = new User(user);
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
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
    const user = await User.findById(id);
    if(!user) {
      return res.status(404).json({success: false, message: "could not find user"})
    }
    req.user = user;
    next()
  } catch (err) {
    res.status(400).json({success: false, message: "an error occurred while retrieving user", errMessage: err.message})
  }
})

router.route("/:id")
.get((req, res) => {
  let {user} = req;
  user.__v = undefined;
  res.status(200).json({success: true, user})
})
.post(async (req, res) => {
  let {user} = req;
  let userUpdates = req.body;
  user = extend(user, userUpdates)
  try {
    user = await user.save();
    res.status(200).json({success: true, message: "user updated", user})
  } catch (err) {
    res.status(500).json({success: false, message: "an error occurred", errMessage: err.message})
  }
})
.delete(async(req, res) => {
  let {user} = req
  try {
    await user.remove()
    res.json({success: true, message: "user successfully removed"})
  } catch (err) {
    res.json({success: false, message: "user could not be removed"})
  }
})

module.exports = router;