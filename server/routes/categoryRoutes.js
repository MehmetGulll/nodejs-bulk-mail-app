const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/getCategories',categoryController.getCategories);
router.post('/addCategory', categoryController.addCategories);

module.exports = router;