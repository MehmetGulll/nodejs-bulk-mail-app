const express = require('express');

const authController = require('../controllers/authController');
const loginMiddleware = require('../middlewares/loginMiddleware');
const validateRegistration = require('../middlewares/validateRegistration')

const router = express.Router();

router.post('/register',validateRegistration, authController.registerUser);
router.post('/login', loginMiddleware, authController.sendLoginResponse);

module.exports=router;