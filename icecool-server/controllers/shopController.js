const Shop = require('../models/Shop');
const User = require('../models/User');

// @desc    Register a new shop
// @route   POST /api/shops
// @access  Private (shop owners only)
exports.registerShop = async (req, res) => {
  try {
    // Check if user is a shop owner
    if (req.user.role !== 'shop_owner' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only shop owners can register shops'
      });
    }

    const {
      name,
      description,
      address,
      contactInfo,
      operatingHours
    } = req.body;

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ owner: req.user.userId });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'You already have a registered shop'
      });
    }

    // Create shop
    const shop = await Shop.create({
      owner: req.user.userId,
      name,
      description,
      address,
      contactInfo,
      operatingHours,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(address.longitude),
          parseFloat(address.latitude)
        ]
      }
    });

    res.status(201).json({
      success: true,
      message: 'Shop registered successfully',
      data: shop
    });
  } catch (error) {
    console.error('Register shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during shop registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
exports.getShops = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km, default 10km

    let query = { isActive: true, isVerified: true };

    // If location provided, find shops within radius
    if (latitude && longitude) {
      query.location = {
        $geoWithin: {
          $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], radius / 6378.1] // Convert km to radians
        }
      };
    }

    const shops = await Shop.find(query)
      .populate('owner', 'name phoneNumber')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching shops',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single shop
// @route   GET /api/shops/:id
// @access  Public
exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'name phoneNumber');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (error) {
    console.error('Get shop by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching shop',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private (shop owner only)
exports.updateShop = async (req, res) => {
  try {
    let shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check if user owns the shop or is admin
    if (shop.owner.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this shop'
      });
    }

    shop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Shop updated successfully',
      data: shop
    });
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating shop',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private (shop owner only)
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check if user owns the shop or is admin
    if (shop.owner.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this shop'
      });
    }

    await shop.remove();

    res.status(200).json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } catch (error) {
    console.error('Delete shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting shop',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get shop products
// @route   GET /api/shops/:id/products
// @access  Public
exports.getShopProducts = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const products = await Product.find({
      shop: req.params.id,
      isAvailable: true
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get shop products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching shop products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};