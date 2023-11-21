const mongoose = require('mongoose');
const productsSchema = new mongoose.Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shops_tb',
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productCatego ry_tb',
    required: true,
  },
  product_name: { type: String, required: true },
  sub_category: { type: String, required: true },
  price: { type: Number, required: true },
  available_quantity: { type: String, required: true, default: 1 },
  offer: { type: Number, required: true },
  image: { type: [String], require: true },
  description: { type: String, required: true },
});

var productsData = mongoose.model('products_tb', productsSchema);
module.exports = productsData;
