const express = require('express');
const {sendEmail, addMail} = require('../controllers/emailController');

const router = express.Router();
router.post('/sendEmail',sendEmail);
router.post('/addEmail', addMail)

module.exports = router;