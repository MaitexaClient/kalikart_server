const mongoose = require('mongoose');
const checkOutSchema = new mongoose.Schema({
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
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  subtotal: {
    type: Number,
    default: function () {
      return this.price;
    },
  },

  order_date: { type: Date, require: true },
  order_status: { type: String, default: 'pending', require: true },
});

var checkoutData = mongoose.model('checkout_tb', checkOutSchema);
module.exports = checkoutData;
