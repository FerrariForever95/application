const mongoose = require('mongoose');

// Product schema
const productSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['ice_cream', 'dessert', 'beverage', 'topping'],
    default: 'ice_cream'
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      trim: true
    }
  }],
  // Customization options
  customizationOptions: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['checkbox', 'radio', 'select', 'input'],
      required: true
    },
    options: [{
      label: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      },
      additionalPrice: {
        type: Number,
        default: 0
      },
      isDefault: {
        type: Boolean,
        default: false
      }
    }],
    isRequired: {
      type: Boolean,
      default: false
    },
    minSelections: {
      type: Number,
      default: 0
    },
    maxSelections: {
      type: Number,
      default: 0
    }
  }],
  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  availableFrom: {
    type: Date
  },
  availableUntil: {
    type: Date
  },
  // Inventory
  inventory: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  // Metrics
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });
// Index for shop queries
productSchema.index({ shop: 1, isAvailable: 1 });
// Index for category queries
productSchema.index({ category: 1, isAvailable: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;