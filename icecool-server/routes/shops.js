const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', shopController.getShops);
router.get('/:id', shopController.getShopById);
router.get('/:id/products', shopController.getShopProducts);

// Protected routes (shop owner only)
router.use(protect);
router.post('/', shopController.registerShop);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);

module.exports = router;