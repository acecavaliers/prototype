const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierControlller');

router.post('/supplier', supplierController.createSupplier);
router.get('/supplier', supplierController.getAllSuppliers);
router.delete('/supplier/:id', supplierController.deleteSupplier);
router.put('/supplier/:id', supplierController.updateSuppliers);
// Define other routes...

module.exports = router;