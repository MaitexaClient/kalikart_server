const mongoose = require('mongoose');
const productsSchema = new mongoose.Schema({
  category: { type: String, required: true },
});

var productsData = mongoose.model('products_tb', productsSchema);
module.exports = productsData;
