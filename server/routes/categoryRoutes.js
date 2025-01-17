const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middlewares/authenticate')

router.get('/getCategories',authenticate,categoryController.getCategories);
router.post('/addCategory', authenticate, categoryController.addCategories);

router.delete('/deleteCategory/:id', authenticate,categoryController.deleteCategory);
router.put('/updateCategory/:id',authenticate,categoryController.updateCategory);

module.exports = router;