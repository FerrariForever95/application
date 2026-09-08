const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// User routes
router.get('/', orderController.getUserOrders);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

// Shop routes
router.get('/shop/:shopId', orderController.getShopOrders);

module.exports = router;