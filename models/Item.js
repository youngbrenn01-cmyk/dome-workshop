const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Electronics', 'Art', 'Furniture', 'Collectibles', 'Other'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sellerType: {
    type: String,
    enum: ['Buy', 'Auction', 'Trade'],
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: String,
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair'],
    required: true,
  },
  auctionEndTime: Date,
  currentBid: {
    type: Number,
    default: null,
  },
  bidders: [{
    user: mongoose.Schema.Types.ObjectId,
    bid: Number,
    timestamp: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', itemSchema);
