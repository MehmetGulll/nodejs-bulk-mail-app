const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler')

exports.registerUser = asyncHandler(async (req, res) => {
    console.log('Request received:', req.body);
    const { email, password, confirmPassword } = req.body;
  
    if (password !== confirmPassword) {
      return res.status(400).send({ error: 'Passwords do not match' });
    }
  
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).send({ message: 'User registered successfully' });
  });