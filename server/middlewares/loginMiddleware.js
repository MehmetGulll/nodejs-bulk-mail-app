const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncHandler = require('./asyncHandler');

const secretKey = "myTokenSecretKey";
const loginMiddleware = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "24h" });

  req.user = {
    id: user._id,
    email: user.email,
    token
  };

  next();
});

module.exports = loginMiddleware;