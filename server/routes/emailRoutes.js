const express = require('express');
const {sendEmail, addMail, listEmails} = require('../controllers/emailController');

const router = express.Router();
router.post('/sendEmail',sendEmail);
router.post('/addEmail', addMail);
router.get('/getEmails',listEmails);

module.exports = router;