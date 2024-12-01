const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ['Not Process', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Not Process',
  },
  payment: {
    success: {
      type: Boolean,
      default: false,
    },
    // Add other payment details if needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel; 
