const mongoose = require('mongoose');
const watchedAdSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },
  banner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'banner_tb',
    required: true,
  },
});

var watchedAdData = mongoose.model('checkout_tb', watchedAdSchema);
module.exports = watchedAdData;
