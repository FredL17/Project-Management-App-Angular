// Libraries.
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// DB models.
const { User } = require("../models/index");

const router = express.Router();

/* User sign up. */
router.post("/signup", (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: "Signed up successfully.",
            result: result
          });
        })
        .catch(err => {
          res.status(400).json({
            message: "Email has already been registered.",
            error: err
          });
        });
    })
    .catch(err => {
      res.status(400).json({
        message: "Sign up failed.",
        error: err
      });
    });
});

/* User login. */
router.post("/login", (req, res) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Email not found."
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Incorrect password."
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "QhIPViSVv5oNadaoVhvIp5zL0HzH1JQO",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: "Logged in successfully.",
        token: token,
        expiredIn: 3600
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(401).json({
        message: "Auth failed.",
        error: err
      });
    });
});

module.exports = router;
