const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authenticate = require('../middlewares/authenticate');

router.post('/uploadFile',authenticate,fileController.uploadFile);

module.exports = router;