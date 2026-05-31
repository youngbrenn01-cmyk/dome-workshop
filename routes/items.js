const express = require('express');
const jwt = require('jsonwebtoken');
const Item = require('../models/Item');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create item
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, category, price, sellerType, condition, image, auctionEndTime } = req.body;
    const item = new Item({
      title,
      description,
      category,
      price,
      sellerType,
      condition,
      image,
      auctionEndTime,
      seller: req.userId,
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
});

// Get all items with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, category, sellerType, sortBy } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (sellerType) filter.sellerType = sellerType;

    let sortOptions = {};
    if (sortBy === 'price-low') sortOptions.price = 1;
    else if (sortBy === 'price-high') sortOptions.price = -1;
    else if (sortBy === 'newest') sortOptions.createdAt = -1;

    const items = await Item.find(filter)
      .populate('seller', 'username fullName')
      .sort(sortOptions);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('seller', 'username fullName').populate('bidders.user', 'username');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
});

// Place bid on auction item
router.post('/:id/bid', verifyToken, async (req, res) => {
  try {
    const { bidAmount } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.sellerType !== 'Auction') return res.status(400).json({ message: 'This item is not for auction' });
    if (new Date() > new Date(item.auctionEndTime)) return res.status(400).json({ message: 'Auction has ended' });
    if (bidAmount <= (item.currentBid || item.price)) return res.status(400).json({ message: 'Bid must be higher than current bid' });

    item.currentBid = bidAmount;
    item.bidders.push({ user: req.userId, bid: bidAmount, timestamp: Date.now() });
    await item.save();

    res.json({ message: 'Bid placed successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error placing bid', error: error.message });
  }
});

// Update item
router.put('/:id', verifyToken, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.seller.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });

    item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});

// Delete item
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.seller.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

module.exports = router;
