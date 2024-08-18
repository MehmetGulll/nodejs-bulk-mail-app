const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middlewares/authenticate')

router.get('/getCategories',categoryController.getCategories);
router.post('/addCategory', authenticate, categoryController.addCategories);

router.delete('/deleteCategory/:id', categoryController.deleteCategory);
router.put('/updateCategory/:id',categoryController.updateCategory);

module.exports = router;