const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secretKey = "myTokenSecretKey";

exports.registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, secretKey, { expiresIn: "24h" });

  res.status(201).send({
    message: "User registered successfully",
    token,
    user: {
      id: newUser._id,
      email: newUser.email,
    },
  });
});

exports.sendLoginResponse = asyncHandler((req, res) => {
  res.status(200).send({
    message: "Logged in successfully",
    token: req.user.token,
    user: {
      id: req.user.id,
      email: req.user.email
    }
  });
});