const mongoose = require("mongoose");
const { Schema } = mongoose
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require("mongoose-type-url")

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
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  chatrooms: [
    {roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room'  
    }, 
    participationType: {
      type: String,
      required: true
    }}
  ], 
  interests: [{
    type: String
  }],
  image: mongoose.SchemaTypes.Url,
  isOnline: {
    type: Boolean, 
    default: false
  }, 
  secret: String
})

UserSchema.pre('save', (next) => {
    let user = this;    
    if(user.isModified('password')) {  
        bcrypt.genSalt(saltRounds, (salt) => {
          try {
            bcrypt.hash(user.password, salt, (hash) => {
                user.password = hash 
                next()
            })
          } catch (err) {
            console.log("error occurred", err.message)
          }})
    } else {
        next()
    }
});

UserSchema.methods.comparePassword = (plainPassword, cb) => {
    bcrypt.compare(plainPassword, this.password, (isMatch) => {
      try {
        cb(null, isMatch)
      } catch (err) {
        console.log("error!", err.message)
      }        
    })
}

UserSchema.methods.generateToken = (cb) => {
    let user = this;
    let token =  jwt.sign(user._id.toHexString(),'secret')

    user.token = token;
    user.save((user) => {
      try {
        cb(null, user);
      } catch (err) {
        console.log("error", err.message)
      }        
    })
}

UserSchema.statics.findByToken = (token, cb) => {
    let user = this;

    jwt.verify(token,'secret',(decode) => {
      try {
        user.findOne({"_id":decode, "token":token}, (user) => {
            cb(null, user);
        })
      } catch (err) {
        console.log("error occurred", err.message)
      }
    })
}

const User = mongoose.model("User", UserSchema);

module.exports = { User }