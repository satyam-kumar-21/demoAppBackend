const mongoose = require('mongoose');

const ScanLogSchema = new mongoose.Schema({
      rider_id: {
            type: String,
            required: true,
      },
      order_id: {
            type: String,
            required: true,
      },
      restaurant_id: {
            type: String,
            required: true,
      },
      location: {
            lat: Number,
            lng: Number
      },
      timestamp: {
            type: Date,
            default: Date.now,
      },
});

module.exports = mongoose.model('ScanLog', ScanLogSchema);
