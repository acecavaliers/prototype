const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');

router.post('/component', componentController.createComponent);
router.get('/component', componentController.getAllComponents);
router.delete('/component/:id', componentController.deleteComponent);
router.put('/component/:id', componentController.updateComponents);
// Define other routes...

module.exports = router;