const express = require('express');
const emailController = require('../controllers/emailController');

const router = express.Router();
router.post('/sendEmail',emailController.sendEmail);
router.post('/addEmail', emailController.addMail);
router.get('/getEmails',emailController.listEmails);
router.delete('/deleteEmail/:id', emailController.deleteMail);
router.put('/updateEmail/:id', emailController.updateEmail);

module.exports = router;