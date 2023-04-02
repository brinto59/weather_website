const User = require("../models/People");
const bcrypt = require("bcrypt");

function getSignup(req, res, next) {
  res.render("signup");
}

async function signUp(req, res, next) {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  let user;
  if (req.files && req.files.length > 0) {
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      avatar: req.files[0].filename,
    });
  } else {
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
  }
  try {
    await user.save();
    res.status(200).json({
      message: "User was added successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
}

module.exports = { getSignup, signUp };
