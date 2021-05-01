const { User } = require('../models/user-model');

let auth = async (req, res, next) => {
  let token = req.cookies.w_auth;

  await User.findByToken(token, (err, user) => {
    try {
      if(!user) {
        return res.status(404).json({ success: false, message: "authentication failed"})
      }

      req.token = token
      req.user = user
      next()

    } catch (err) {
      console.log("Error occurred", err.message);
    }
  });
};

module.exports = { auth };