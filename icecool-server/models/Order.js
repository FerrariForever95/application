const mongoose = require('mongoose');

// Order schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    // Customizations selected for this item
    customizations: [{
      customizationName: {
        type: String,
        required: true
      },
      selectedOption: {
        type: String,
        required: true
      },
      additionalPrice: {
        type: Number,
        default: 0
      }
    }],
    // Price at time of order (to protect against price changes)
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  // Delivery information
  deliveryAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  deliveryLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  // Order status
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'upi', 'wallet'],
    default: 'cod'
  },
  paymentId: {
    type: String, // Reference to payment gateway
    default: null
  },
  // Timestamps
  placedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  },
  preparingAt: {
    type: Date
  },
  readyAt: {
    type: Date
  },
  outForDeliveryAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  // Notes
  customerNotes: {
    type: String,
    trim: true
  },
  shopNotes: {
    type: String,
    trim: true
  },
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Indexes for queries
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ shop: 1, status: 1 });
orderSchema.index({ status: 1, placedAt: -1 });
orderSchema.index({ deliveryLocation: '2dsphere' });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;