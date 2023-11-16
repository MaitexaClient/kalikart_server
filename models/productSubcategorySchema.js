const mongoose = require('mongoose');
const productSubCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
});

var subCategoryData = mongoose.model(
  'productSubCategory_tb',
  productSubCategorySchema
);
module.exports = subCategoryData;
