const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const lodash = require("lodash")
const {extend} = lodash

const { User } = require("../models/user-model");
const { auth } = require("../middleware/auth");

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === ("SuperAdmin" || "Admin") ? true : false,
    isAuth: true,
    name: req.user.name,
    image: req.user.image,
    currentChatroom: req.user.currentChatroom,
    chatrooms: req.user.chatrooms,
    interests: req.user.interests
  });
});

router.post("/signup", async (req, res) => {
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


router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({name: req.body.name});
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "authentication failed"
      })
    }
    const isMatch = user.comparePassword(req.body.password);
    if(!isMatch) {
      return res.status(404).json({
        status: false,
        message: "Wrong Password!"
      })
    }

    user.generateToken(user => {
      try {
        res.cookie("w_auth", user.secret).status(200).json({
          success: true,
          message: "Login Successful"
        })
      } catch (err) {
        res.status(404).json({
          success: false,
          message: "error occurred while logging in",
          errMessage: err.message
        })
      }
    })
  } catch (err) {
    res.status(404).json({ success: false, message: "an error occurred", errMessage: err.message})
  }
})

router.get("/logout", auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.user._id }, 
    {secret: ""})
    return res.status(200).json({success: true})
  } catch (err) {
    console.log("error occurred while logging out", err.message);
  }
});

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