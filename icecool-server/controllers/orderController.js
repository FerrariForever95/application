const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const User = require('../models/User');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (users only)
exports.createOrder = async (req, res) => {
  try {
    // Check if user is a customer
    if (req.user.role !== 'user' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only users can place orders'
      });
    }

    const {
      shopId,
      items,
      deliveryAddress,
      deliveryLocation,
      paymentMethod,
      customerNotes
    } = req.body;

    // Validate shop exists and is active
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    if (!shop.isActive || !shop.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Shop is not currently available'
      });
    }

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      // Calculate customization price
      let customizationPrice = 0;
      const selectedCustomizations = [];

      for (const customization of item.customizations || []) {
        const customOption = product.customizationOptions.find(
          opt => opt.name === customization.customizationName
        );

        if (customOption) {
          const selectedOption = customOption.options.find(
            opt => opt.value === customization.selectedOption
          );

          if (selectedOption) {
            customizationPrice += selectedOption.additionalPrice;
            selectedCustomizations.push({
              customizationName: customization.customizationName,
              selectedOption: customization.selectedOption,
              additionalPrice: selectedOption.additionalPrice || 0
            });
          }
        }
      }

      const unitPrice = product.basePrice + customizationPrice;
      const totalPrice = unitPrice * item.quantity;

      subtotal += totalPrice;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        customizations: selectedCustomizations,
        unitPrice,
        totalPrice
      });
    }

    // Calculate delivery fee (simplified)
    const deliveryFee = 0; // In a real app, calculate based on distance

    // Calculate tax (simplified)
    const taxAmount = subtotal * 0.05; // 5% tax

    const totalAmount = subtotal + deliveryFee + taxAmount;

    // Create order
    const order = await Order.create({
      user: req.user.userId,
      shop: shopId,
      items: orderItems,
      deliveryAddress,
      deliveryLocation: {
        type: 'Point',
        coordinates: [
          parseFloat(deliveryLocation.longitude),
          parseFloat(deliveryLocation.latitude)
        ]
      },
      subtotal,
      deliveryFee,
      taxAmount,
      totalAmount,
      paymentMethod,
      status: 'placed'
    });

    // Notify shop via socket.io (would be implemented in socket handler)
    // req.io.to(`shop-${shopId}`).emit('new-order', order);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const { status } = req.query;

    let query = { user: req.user.userId };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('shop', 'name address')
      .populate('items.product', 'name images')
      .sort({ placedAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('shop', 'name address contactInfo')
      .populate('user', 'name phoneNumber')
      .populate('items.product', 'name images')
      .populate('deliveryPerson', 'name phoneNumber');

    // Check if user owns the order or is shop owner/admin/delivery person
    const isOwner = order.user._id.toString() === req.user.userId.toString();
    const isShopOwner = order.shop.owner.toString() === req.user.userId.toString();
    const isDeliveryPerson = order.deliveryPerson &&
      order.deliveryPerson._id.toString() === req.user.userId.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isShopOwner && !isDeliveryPerson && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (shop owner or delivery person)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    let order = await Order.findById(req.params.id)
      .populate('shop', 'owner');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    const isShopOwner = order.shop.owner.toString() === req.user.userId.toString();
    const isDeliveryPerson = order.deliveryPerson &&
      order.deliveryPerson._id.toString() === req.user.userId.toString();
    const isAdmin = req.user.role === 'admin';

    // Only shop owner, delivery person assigned to order, or admin can update status
    if (!isShopOwner && !isDeliveryPerson && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order status'
      });
    }

    // Additional validation for status transitions
    const statusOrder = ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);
    const newIndex = statusOrder.indexOf(status);

    // Allow cancellation from any status
    if (status !== 'cancelled' &&
        (newIndex < currentIndex ||
         (status === 'out_for_delivery' && order.status !== 'ready') ||
         (status === 'delivered' && !(order.status === 'out_for_delivery' || order.status === 'ready')))) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${order.status} to ${status}`
      });
    }

    // Update order
    const updateData = { status };
    if (status === 'confirmed') updateData.confirmedAt = new Date();
    if (status === 'preparing') updateData.preparingAt = new Date();
    if (status === 'ready') updateData.readyAt = new Date();
    if (status === 'out_for_delivery') updateData.outForDeliveryAt = new Date();
    if (status === 'delivered') updateData.deliveredAt = new Date();
    if (status === 'cancelled') updateData.cancelledAt = new Date();

    order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('shop', 'name address')
      .populate('user', 'name phoneNumber')
      .populate('items.product', 'name images')
      .populate('deliveryPerson', 'name phoneNumber');

    // Emit socket event for real-time updates
    // req.io.to(`user-${order.user._id}`).emit('order-status-update', order);
    // if (order.shop.owner) {
    //   req.io.to(`shop-${order.shop.owner._id}`).emit('order-status-update', order);
    // }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get shop orders
// @route   GET /api/orders/shop/:shopId
// @access  Private (shop owners only)
exports.getShopOrders = async (req, res) => {
  try {
    // Check if user is shop owner
    if (req.user.role !== 'shop_owner' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only shop owners can access shop orders'
      });
    }

    const { status } = req.query;

    // Verify shop ownership
    const shop = await Shop.findOne({
      _id: req.params.shopId,
      owner: req.user.userId
    });

    if (!shop && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access orders for this shop'
      });
    }

    let query = { shop: req.params.shopId };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name phoneNumber')
      .populate('items.product', 'name images')
      .sort({ placedAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching shop orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};