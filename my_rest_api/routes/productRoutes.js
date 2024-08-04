const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/product', productController.createProduct);
router.get('/product', productController.getAllProducts);
router.delete('/product/:id', productController.deleteProduct);
router.put('/product/:id', productController.updateProduct);


module.exports = router;