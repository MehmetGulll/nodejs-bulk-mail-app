const User = require('../models/User');
const validateRegistration = async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
  
    if (password !== confirmPassword) {
      return res.status(400).send({ error: "Passwords do not match" });
    }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "User already exists" });
    }
  
    next();
  };
  
  module.exports = validateRegistration;