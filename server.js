require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// For demo purposes, we can use a local URI or the user would provide one. 
// Assuming local for now if not provided in env, but typically we want a real one.
// I will use a placeholder or local.
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Models
const ScanLog = require('./models/ScanLog');

// Routes

/**
 * @route   POST /api/scan
 * @desc    Log a rider pickup scan
 * @access  Public
 */
app.post('/api/scan', async (req, res) => {
  try {
    const { rider_id, order_id, restaurant_id, location } = req.body;

    if (!rider_id || !order_id || !restaurant_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newScan = new ScanLog({
      rider_id,
      order_id,
      restaurant_id,
      location, // Expecting { lat, lng }
      timestamp: new Date()
    });

    await newScan.save();

    const orderDetails = {
      customer: {
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        address: "Flat 402, Sunshine Apartments, HSR Layout, Bangalore"
      },
      items: [
        { name: "Chicken Biryani", quantity: 1, price: 250 },
        { name: "Butter Naan", quantity: 2, price: 40 },
        { name: "Paneer Butter Masala", quantity: 1, price: 220 },
        { name: "Coke", quantity: 2, price: 40 }
      ],
      billDetails: {
        subtotal: 590,
        deliveryFee: 40,
        tax: 30,
        total: 660
      },
      paymentStatus: "PAID",
      instructions: "Leave at door, do not ring bell"
    };

    res.status(201).json({
      success: true,
      message: 'Pickup logged successfully',
      data: newScan,
      orderDetails
    });
  } catch (error) {
    console.error('Scan Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

/**
 * @route   GET /api/logs
 * @desc    Get all scan logs (for demo verification)
 * @access  Public
 */
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await ScanLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

