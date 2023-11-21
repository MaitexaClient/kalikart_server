const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products_tb',
    required: true,
  },
});

var wishlistData = mongoose.model('wishlist_tb', wishlistSchema);
module.exports = wishlistData;
