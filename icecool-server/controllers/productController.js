const Product = require('../models/Product');
const Shop = require('../models/Shop');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (shop owners only)
exports.createProduct = async (req, res) => {
  try {
    // Check if user is a shop owner
    if (req.user.role !== 'shop_owner' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only shop owners can create products'
      });
    }

    const {
      name,
      description,
      category,
      basePrice,
      images,
      customizationOptions
    } = req.body;

    // Verify shop ownership
    const shop = await Shop.findOne({
      _id: req.body.shop,
      owner: req.user.userId
    });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add products to this shop'
      });
    }

    // Create product
    const product = await Product.create({
      shop: req.body.shop,
      name,
      description,
      category,
      basePrice,
      images,
      customizationOptions
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, shopId, search } = req.query;

    let query = { isAvailable: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by shop
    if (shopId) {
      query.shop = shopId;
    }

    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .populate('shop', 'name address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shop', 'name address contactInfo');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (shop owner only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the shop or is admin
    const shop = await Shop.findById(product.shop);
    if (shop.owner.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (shop owner only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the shop or is admin
    const shop = await Shop.findById(product.shop);
    if (shop.owner.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle product availability
// @route   PATCH /api/products/:id/toggle-availability
// @access  Private (shop owner only)
exports.toggleAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the shop or is admin
    const shop = await Shop.findById(product.shop);
    if (shop.owner.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isAvailable ? 'made available' : 'marked as unavailable'}`,
      data: product
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error toggling product availability',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};