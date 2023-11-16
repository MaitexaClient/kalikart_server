const mongoose = require('mongoose');
const productCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
});

var categoryData = mongoose.model('productCategory_tb', productCategorySchema);
module.exports = categoryData;
