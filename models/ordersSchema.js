const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
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
  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'address_tb',
    require: true,
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
  wallet_amount_used: { type: Number, default: 0, require: true },
  razor_pay_amount: { type: Number, default: 0, require: true },
});

var orderData = mongoose.model('orders_tb', orderSchema);
module.exports = orderData;
