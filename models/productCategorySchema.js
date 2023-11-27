const mongoose = require('mongoose');
const productCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  image: { type: [String], require: true },
});

var categoryData = mongoose.model('productCategory_tb', productCategorySchema);
module.exports = categoryData;
